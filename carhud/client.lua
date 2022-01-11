local isbelt = false
local iscruise = false
local currVeh = 0 
local playerPed = nil
local vehicle = nil
local cruiseSpeed = 999.0

local vehData = {
    hasBelt = false,
    engineRunning = false,
    hasCruise = false,

    currSpd = 0.0,
    cruiseSpd = 0.0,
    prevVelocity = {x = 0.0, y = 0.0, z = 0.0}, 
};
        
Citizen.CreateThread(function()

    while true do
        Citizen.Wait(50)
        playerPed = PlayerPedId()
         if IsPedInAnyVehicle(playerPed, true) then
            Citizen.Wait(50)
            vehicle = GetVehiclePedIsIn(playerPed, false)
            currVeh = vehicle
            local FuelLevel = GetVehicleFuelLevel(vehicle)
            dooropened = false
            for i = 0, 3 do
                local doorsangle = GetVehicleDoorAngleRatio(vehicle, i)
                if doorsangle ~= 0.0 then
                    dooropened = true
                end
            end
            trunkopened = false 
            local trunkangle = GetVehicleDoorAngleRatio(vehicle, 5)
                if trunkangle ~= 0.0 then
                    trunkopened = true
                end
            local retval, lights, highbeams = GetVehicleLightsState(vehicle) 
            lightsopened = false 
            if lights ~= 0 then
                lightsopened = true                
            end
            if highbeams ~= 0 then
                lightsopened = true
            end

            SendNUIMessage({
                type = "carHud",
                fuel = FuelLevel,
                doors = dooropened,
                light = lightsopened,
                belt = isbelt,
                engine = GetIsVehicleEngineRunning(vehicle),
                trunk = trunkopened,
                cruise = iscruise
            })
            SendNUIMessage({
                type = "vehSpeed",
                speed = math.floor((tonumber(GetEntitySpeed(vehicle))) * 3.6)
            })
            SendNUIMessage({
                type = "inVeh",
                data = "open"
            })
        else
            Citizen.Wait(1)
            SendNUIMessage({
                type = "inVeh",
                data = "close"
            })
        end
    end
end)

Citizen.CreateThread(function()

    while true do
        Citizen.Wait(0)
        if IsPedInAnyVehicle(playerPed, true) then
            if IsControlJustReleased(0, 311) then
                if not isbelt then
                    isbelt = true
                else
                    isbelt = false
                end
            end
            local isDriver = (GetPedInVehicleSeat(currVeh, -1) == playerPed);
            if IsControlJustReleased(0, 246) and isDriver then
                if not iscruise then
                    iscruise = true
                else
                    iscruise = false
                end
            end
        end
    end
end)

Citizen.CreateThread(function()

    while true do
        Citizen.Wait(0)
        if IsPedInAnyVehicle(playerPed, true) then
            local position = GetEntityCoords(playerPed);
            local prevSpeed = vehData['currSpd'];
            vehData['currSpd'] = GetEntitySpeed(currVeh);
            if not isbelt then
                local vehIsMovingFwd = GetEntitySpeedVector(currVeh, true).y > 1.0
                local vehAcc = (prevSpeed - vehData['currSpd']) / GetFrameTime()

                if (vehIsMovingFwd and (prevSpeed > 45 / 2.237) and (vehAcc > 100 * 9.81)) then
                    SetEntityCoords(playerPed, position.x, position.y, position.z - 0.47, true, true, true);
                    SetEntityVelocity(playerPed, vehData['prevVelocity'].x, vehData['prevVelocity'].y, vehData['prevVelocity'].z);
                    Citizen.Wait(1);
                    SetPedToRagdoll(playerPed, 1000, 1000, 0, 0, 0, 0);
                else
                    vehData['prevVelocity'] = GetEntityVelocity(currVeh);
                end
            else
                DisableControlAction(0, 75);
            end


            if not iscruise then
                SetEntityMaxSpeed(vehicle, 999.0)
            else
                cruiseSpeed = vehData['currSpd']
                local maxSpeed = cruiseSpeed
                SetEntityMaxSpeed(vehicle, maxSpeed)
            end
        else
            isbelt = false
            iscruise = false
            currVeh = 0 
            playerPed = nil
            vehicle = nil
            cruiseSpeed = 999.0

            vehData = {
                hasBelt = false,
                engineRunning = false,
                hasCruise = false,

                currSpd = 0.0,
                cruiseSpd = 0.0,
                prevVelocity = {x = 0.0, y = 0.0, z = 0.0}, 
            };
        end
    end
end)

Citizen.CreateThread(function()

    local isPauseMenu = false

	while true do
		Citizen.Wait(0)

		if IsPauseMenuActive() then -- ESC Key
			if not isPauseMenu then
				isPauseMenu = not isPauseMenu
				SendNUIMessage({ action = 'toggleUi', value = false })
			end
		else
			if isPauseMenu then
				isPauseMenu = not isPauseMenu
				SendNUIMessage({ action = 'toggleUi', value = true })
			end

			HideHudComponentThisFrame(1)  -- Wanted Stars
			--HideHudComponentThisFrame(2)  -- Weapon Icon
			HideHudComponentThisFrame(3)  -- Cash
			HideHudComponentThisFrame(4)  -- MP Cash
			HideHudComponentThisFrame(6)  -- Vehicle Name
			HideHudComponentThisFrame(7)  -- Area Name
			HideHudComponentThisFrame(8)  -- Vehicle Class
			HideHudComponentThisFrame(9)  -- Street Name
			HideHudComponentThisFrame(13) -- Cash Change
			HideHudComponentThisFrame(17) -- Save Game
			--HideHudComponentThisFrame(20) -- Weapon Stats
		end


	end
end)

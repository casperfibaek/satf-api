const _getFunctionLevel = (functionName: string): Number => {    
    const functionLookup = {
        api_version: 0,
        latlng_to_what3words: 0, 
        what3words_to_latlng: 0,
        latlng_to_pluscode: 0,
        pluscode_to_latlng: 0,
        population_density_walk: 0,
        population_density_bike: 0,
        population_density_car: 0,
        pop_density_isochrone_walk: 1, 
        pop_density_isochrone_bike: 1,
        pop_density_isochrone_car: 1,
        isochrone_walk: 2,
        isochrone_bike: 2,
        isochrone_car: 2,
        nightlights: 1,
        demography: 1,
        population_density_buffer: 0,
        population_buffer: 1,
        urban_status: 0,
        urban_status_simple: 0,
        admin_level_1: 0,
        admin_level_2: 0,
        admin_level_2_fuzzy_tri: 0,
        admin_level_2_fuzzy_lev: 0,
        nearest_placename: 0,
        nearest_poi: 0,
        nearest_bank: 0,
        nearest_bank_distance: 0,
        nearest_waterbody: 0, 
        get_banks: 1,
        a_to_b_time_distance_walk: 1,
        a_to_b_time_distance_bike: 1,
        a_to_b_time_distance_car: 1,
        network_coverage: 1,
        oci_coverage: 1,
        mce_coverage: 1,
        get_forecast: 1,
        get_api_isochrone: 1,
        get_api_directions: 1,
        login_user_get: 0,
        login_user: 0,
        create_user: 2,
        delete_user: 2,
        // error_log: 0,
        NDVI_monthly: 1,
        avg_NDVI: 1,
        vegetation_monitoring: 1,
        get_user_layer_metadata: 1,
        get_layer_geoms: 1,
        delete_layer: 1,
        update_layer_data: 1,
        create_layer: 1,
    }
    if (functionName in functionLookup) {
        return functionLookup[functionName]
    }
    else {
        return 1000
    }
}

const _getUserLevel = (userName: string): number => {

    const organizationLookup = {
        'niras': {
            'users': ['etrott'],
            'permissionLevel': 2,
            // 'token': 'asifga89dsyh118y7kg7893jdklfu89dufidjmk2314u8e9tuiogklxcglu8989043tu89ki',
        },
        'dss': {
            'users': [],
            'permissionLevel': 1,
            // 'token': '238ihff789h9hsdog-.,.,.7f7d789osidjiosdghsdjkhgjsdghjklsdhgjkfjkghjkgfjd892',
        },
        'dma': {
            'users': [],
            'permissionLevel': 1,
            // 'token': '238ihff789h9hsdog-.,.,.7f7d789osidjiosdghsdjkhgjsdghjklsdhgjkfjkghjkgfjd892',
        },

    }
    for (const org in organizationLookup) {
			if (organizationLookup[org].users.includes(userName)) {
                  return organizationLookup[org].permissionLevel
        } 
    } 
    return 0
}

export default function validatePermissionLevel(userName: string, functionName: string): boolean {
    if (_getUserLevel(userName) >= _getFunctionLevel(functionName)) {
        return true
    } else {
        return false
    }
}

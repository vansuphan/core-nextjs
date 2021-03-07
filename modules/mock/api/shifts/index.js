import request, { getDefaultHeaders, clearObject, getStringQuery } from "modules/mock/api";

export function getShifts(token, query) {
    const cleanQuery = clearObject(query);
    const params = getStringQuery(cleanQuery);
    const headers  =  getDefaultHeaders(token);

    return request({
        method: 'GET',
        url: `/shifts?${params}`,
        headers
    });
}

export function postShift(data, token) {
    
    const headers  =  getDefaultHeaders(token);
    return request({
        method: 'POST',
        url: '/shifts',
        headers,
        data
    });
}

export function putShift(id, data, token) {

    const headers  =  getDefaultHeaders(token);
    return request({
        method: 'PUT',
        url: `/shifts/${id}`,
        headers,
        data
    });
}

export function getShift(id, token) {

    const headers  =  getDefaultHeaders(token);
    return request({
        method: 'GET',
        url: `/shifts/${id}`,
        headers,
    });
}

export function deleteShift(id, token) {

    const headers  =  getDefaultHeaders(token);
    return request({
        method: 'DELETE',
        url: `/shifts/${id}`,
        headers,
    });
}


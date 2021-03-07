export const initialShift = {
    ownerId: null,
    type: 0,
    description: {
        vi: '',
        en: ''
    },
    start: {
        hour: 0,
        minute: 0
    },
    end: {
        hour: 23,
        minute: 0
    },
    active: true,
    sortOrder: 1
}

export const initialAgency = {
    ownerId: null,
    type: 0,
    name: {
        vi: '',
        en: ''
    },
    address: {
        vi: '',
        en: ''
    },
    phone: {
        normal: '',
        emergency: ''
    },
    latitude: '',
    longitude: '',
    active: true,
    sortOrder: 1,
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
}

export const initialPreviewImage = {
    visible: false,
    image: '',
    title: ''
}

export const queryInitial = {
    limit: 10,
    page: 1,
    hasPaginate: true,
}

export const sortInitial = {
    _id: -1
}

export const paginationInitial = {
    current: 1,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
    showSizeChanger: true,
    showTitle: true,
    total: 0,
    hasPaginate: true
}
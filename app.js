let currentUser = null;

    if (
        url.includes('/trips') &&
        (!options || options.method === 'GET')
    ) {

        const trips = JSON.parse(
            localStorage.getItem('traveloopTrips')
        ) || [];

        return {
            ok: true,
            async json() {
                return trips;
            }
        };
    }

    // =========================
    // TRIP PLACES
    // =========================

    if (url.includes('/trip-places')) {

        return {
            ok: true,
            async json() {
                return [];
            }
        };
    }

    // =========================
    // DEFAULT
    // =========================

    return {
        ok: true,

        async json() {
            return [];
        },

        async text() {
            return '';
        }
    };
};

// =========================
// APP START
// =========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Traveloop Started Successfully');
});

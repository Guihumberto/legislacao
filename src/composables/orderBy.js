export const useOrderBy = (key, reverse = true) => (a, b) => {

    if (reverse) {
        return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
    } else {
        return a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0;
    }
}
/**
 * This class offers some utilities used across the application.
 */

/**
 * This method search the smallest repeated substring of the
 * whole string
 *
 * @param str the string to analyse
 */
export function getMinRepeatedSubstring(str: string): string {
    const len = str.length;
    loop: for (let i = 1; i < len; i++) {
        if (len % i === 0) {
            const first = str.substr(0, i);
            // For each subparts, if one is not the same
            // check with the next (continue "loop")
            for (let offset = i; offset < len; offset += i) {
                if (first !== str.substr(offset, i)) {
                    continue loop;
                }
            }
            // Return the first found,
            // it's the smallest
            return first;
        }
    }
    return str;
}

/**
 * This method calculates the greatest common divider of two
 * positive integer values using The Euclidean Algorithm PRE: p
 * and q must be positive integer values
 *
 * @param p is the first positive integer value
 * @param q is the second positive integer value
 */
export function gcd(p: number, q: number): number {
    while (q !== 0) {
        const r = p % q;
        p = q;
        q = r;
    }
    return p;
}

/**
 * This is a set of hex web colors used to color boolean charts
 */
export const colors = [
    '#001f3f', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970', '#2ECC40',
    '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144b', '#5B3822',
    '#F012BE', '#B10DC9', '#2B0F0E', '#111111', '#AAAAAA', '#3F5D7D',
    '#927054', '#00FF00', '#279B61', '#008AB8', '#993333', '#CC3333',
    '#006495', '#004C70', '#0093D1', '#F2635F', '#F4D00C', '#E0A025',
    '#0000FF', '#462066', '#FFB85F', '#FF7A5A', '#00AAA0', '#5D4C46',
    '#7B8D8E', '#632528', '#3F2518', '#333333', '#FFCC00', '#669966',
    '#993366', '#F14C38', '#144955', '#6633CC', '#EF34A2', '#FD9308',
    '#462D44', '#3399FF', '#99D21B', '#B08749', '#FFA3D6', '#00D9FF',
    '#000000', '#FF0000', '#2CB050',
];

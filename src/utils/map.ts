/**
 * Re-maps a number from one range to another.
 * @export
 * @param {number} value 
 * @param {number} istart 
 * @param {number} istop 
 * @param {number} ostart 
 * @param {number} ostop 
 * @returns 
 */
export function map(value:number, istart:number, istop:number, ostart:number, ostop:number) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
};
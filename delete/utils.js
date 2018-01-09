
const Utils = {
    parseDataValue(value) {
        if (value === '') return 'true';
        if (value === false || value === true || value == 'true' || value == 'false') return String(value);
        if (!isNaN(Number(value))) return value;
        return `'${value}'`;
    }
};

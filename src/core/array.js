let proto = Array.prototype;

proto.remove = function(item) {
    let i = this.findIndex(e => e === item);
    
    if (i >= 0) {
        return this.splice(i, 1);
    }

    return null;
};

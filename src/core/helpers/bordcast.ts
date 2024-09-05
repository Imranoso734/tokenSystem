class GlobleVariable {
    data: any;

    constructor() {
        this.data = {};
    }

    set(key: any, value: any) {
        this.data[key] = value;
    }

    get(key: any) {
        return this.data[key];
    }

    getAll(siteId: number) {
        let obj = {}
        Object.keys(this.data).forEach((key) => {
            if (this.data[key].siteId == siteId) {
                obj = this.data
            }
        });
        return obj;
    }

    remove(key: any) {
        if (this.data.hasOwnProperty(key)) {
            delete this.data[key];
            return true; // Indicate successful removal
        } else {
            return false; // Key does not exist in data
        }
    }
}

export default new GlobleVariable();

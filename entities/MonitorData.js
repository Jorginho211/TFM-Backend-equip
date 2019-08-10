class MonitorData {
    constructor(date, place, equipments){
        this.date = date;
        this.equipments = equipments === undefined ? [] : equipments;
        this.place = place;
    }
}

module.exports = MonitorData;
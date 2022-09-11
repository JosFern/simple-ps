
class Slot{
    constructor(slotType, pos, car){
        this.slotType = slotType;
        this.pos = pos;
        this.car = car;
    }

    setOccupied(car) {
        this.car = car;
        console.log("setoccupied executed");
    }
    setAvailable() {
        this.car = null;
        console.log("set available executed");
        console.log(this.car);
    }
}

class ParkingLot{
    slots = new Map();
    entryPoints = ['A', 'B', 'C'];

    assignSlots(parkingSlots) {
        for (let i = 0; i < parkingSlots.length; i++){
            var slot = new Slot(parkingSlots[i].type, parkingSlots[i].position, parkingSlots[i].vehicle)
            this.slots.set(i, slot);
        }
        console.log(this.slots);
    }

    park(entry, car) {
        console.log("park function executed");

        let slotNum = this.getAvailableSlot(entry, car);

        console.log(slotNum);
        this.slots.get(slotNum[0]).setOccupied({type: car, timeIn: new Date().getTime(), timeOut: null});
    }
    unparkCar(slot) {
        this.slots.get(slot).setAvailable();
    }
    getAvailableSlot(entry, car) {
        const numEnt = entry == "A" ? 0 : entry == "B" ? 1 : 2;

        let arr = [];

        this.slots.forEach((keys, values) => {
            if (keys.car == null && car <= keys.slotType) {
                arr.push(keys.pos[numEnt]);
            }
        });

        console.log("min slot: "+Math.min(...arr));


        const nearSlot = new Map([...this.slots].filter(([k, v]) => v.pos[numEnt] == Math.min(...arr) && v.car == null && car <= v.slotType));

        console.log(nearSlot);

        return [...nearSlot][0];
    }
}


const slots = [
    { type: 0, position: [2, 5, 11], vehicle: null },
    { type: 0, position: [3, 4, 10], vehicle: null },
    { type: 0, position: [4, 3, 9], vehicle: null },
    { type: 0, position: [5, 2, 8], vehicle: null },
    { type: 1, position: [6, 1, 7], vehicle: null },
    { type: 1, position: [7, 1, 6], vehicle: null },
    { type: 1, position: [8, 2, 5], vehicle: null },
    { type: 2, position: [9, 3, 4], vehicle: null },
    { type: 2, position: [10, 4, 3], vehicle: null },
    { type: 2, position: [11, 5, 2], vehicle: null },
    // next row
    { type: 0, position: [1, 6, 10], vehicle: null },
    { type: 0, position: [2, 5, 9], vehicle: null },
    { type: 0, position: [3, 4, 8], vehicle: null },
    { type: 0, position: [4, 3, 7], vehicle: null },
    { type: 1, position: [5, 2, 6], vehicle: null },
    { type: 1, position: [6, 2, 5], vehicle: null },
    { type: 1, position: [7, 3, 4], vehicle: null },
    { type: 2, position: [8, 4, 3], vehicle: null },
    { type: 2, position: [9, 5, 2], vehicle: null },
    { type: 2, position: [10, 6, 1], vehicle: null },
    // next row
    { type: 0, position: [2, 7, 11], vehicle: null },
    { type: 0, position: [3, 6, 10], vehicle: null },
    { type: 0, position: [4, 5, 9], vehicle: null },
    { type: 0, position: [5, 4, 8], vehicle: null },
    { type: 1, position: [6, 3, 7], vehicle: null },
    { type: 1, position: [7, 3, 6], vehicle: null },
    { type: 1, position: [8, 4, 5], vehicle: null },
    { type: 2, position: [9, 5, 4], vehicle: null },
    { type: 2, position: [10, 6, 3], vehicle: null },
    { type: 2, position: [11, 7, 2], vehicle: null },
    // next row
    { type: 0, position: [3, 8, 12], vehicle: null },
    { type: 0, position: [4, 7, 11], vehicle: null },
    { type: 0, position: [5, 6, 10], vehicle: null },
    { type: 0, position: [6, 5, 9], vehicle: null },
    { type: 1, position: [7, 4, 8], vehicle: null },
    { type: 1, position: [8, 4, 7], vehicle: null },
    { type: 1, position: [9, 5, 6], vehicle: null },
    { type: 2, position: [10, 6, 5], vehicle: null },
    { type: 2, position: [11, 7, 4], vehicle: null },
    { type: 2, position: [12, 8, 3], vehicle: null },
]

const parkinglot = new ParkingLot();
parkinglot.assignSlots(slots);


const app = Vue.createApp({
    data() {
        return {
            title: 'Parking System',
            parkSlots: parkinglot.slots,
            entryPoints: parkinglot.entryPoints,
            showModal: false,
            unparkModal: false,
            entryInput: null,
            carTypeInput: null,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            payment: 0,
            currSlot: null
        }
    },
    methods: {
        toggleModal() {
            this.showModal = !this.showModal
        },
        toggleUnparkModal() {
            this.unparkModal = !this.unparkModal
        },
        parkCar() {
            this.entryInput = this.$refs.entryinput.value;
            this.carTypeInput = this.$refs.cartypeinput.value;
            console.log(this.entryInput + ' ' + this.carTypeInput);
            parkinglot.park(this.entryInput, this.carTypeInput);
            this.toggleModal();
        },
        calculateToUnpark(slot) {
            this.currSlot = slot;
            this.toggleUnparkModal();
            if (this.parkSlots.get(slot).car != null) {
                this.parkSlots.get(slot).car.timeOut = new Date().getTime();
                const totalSeconds = (this.parkSlots.get(slot).car.timeOut - this.parkSlots.get(slot).car.timeIn) / 1000;

                this.days = Math.floor(totalSeconds / 3600 /24);
                this.hours = Math.floor(totalSeconds / 3600) % 24;
                this.minutes = Math.floor(totalSeconds/60)%60;
                this.seconds = Math.floor(totalSeconds) % 60;
                console.log("day/s :" + this.days + "\nhour/s: " + this.hours + "\nminutes :" + this.minutes + "\nseconds :" + this.seconds);


                // start calculate fees

                this.payment = this.days > 0 ? this.days * 5000 : 40;
                const exceedHrRate = 3;
                

                
                if (this.parkSlots.get(slot).slotType == 0) {
                    console.log("slot type 0");
                    this.payment += this.hours >= exceedHrRate ? (Math.round(this.minutes / 60) == 1 ? 20 + (this.hours-exceedHrRate)*20: (this.hours-exceedHrRate)*20) : 0;
                } else if (this.parkSlots.get(slot).slotType == 1) {
                    console.log("slot type 1");
                    this.payment += this.hours >= exceedHrRate ? (Math.round(this.minutes / 60) == 1 ? 60 + (this.hours-exceedHrRate)*60: (this.hours-exceedHrRate)*60) : 0;
                } else {
                    console.log("slot type 2");
                    this.payment += this.hours >= exceedHrRate ? (Math.round(this.minutes / 60) == 1 ? 100 + (this.hours-exceedHrRate)*100: (this.hours-exceedHrRate)*100) : 0;
                }

                console.log("payment: " + this.payment);
                
                
            }


        },
        unpark(slot) {
            console.log("unpark car :" + slot);
            parkinglot.unparkCar(slot);
            this.currSlot = null;
            this.$forceUpdate();
            this.toggleUnparkModal();
        }
    }
});

app.mount('#app');



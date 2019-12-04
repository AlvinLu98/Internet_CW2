class Booking {
    constructor(ref, c_no, b_cost, b_outstanding, b_notes) {
        this.ref = ref;
        this.c_no = c_no;
        this.b_cost = b_cost;
        this.b_outstanding = b_outstanding;
        this.b_notes = b_notes;
    }

    calculateAmountPaid() {
        return this.b_cost - this.b_outstanding;
    }

    toString() {
        console.log(`
        Booking ref:     ${this.ref}
        Customer no:     ${this.c_no}
        Booking cost:    ${this.b_cost}
        Oustanding cost: ${this.b_outstanding}
        Notes:           ${this.b_notes}
        `)
    }
}

module.exports = Booking;
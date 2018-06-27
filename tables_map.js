// File: tables_map.js
// Module representing location of the seats and tables on the map

const PRICE_1 = 200, PRICE_2 = 100;
const NUM_SEATS_1 = 10;
const tables_info = {
    "high_class": [PRICE_1, "#A3C0C4"],
    "low_class": [PRICE_2, "#4D1D29"]
};

class Furniture {
    constructor(x, y, color, id, radius) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
        this.radius = radius;
    }
}

class Table extends Furniture {
    constructor(x, y, id, class_type, color, radius = 20) {
        super(x, y, color, id, radius);
        this.class_type = class_type;
    }

    find_point(x0, y0, alpha) {
        let rx = x0 - this.x,
            ry = y0 - this.y;
        let c = Math.cos(alpha),
            s = Math.sin(alpha);
        let x1 = this.x + rx * c - ry * s,
            y1 = this.y + rx * s + ry * c;
        return [x1, y1]
    }

    draw_seats(seats_number, paper) {
        //draw the table
        let table = paper.circle(this.x * this.radius, this.y * this.radius, this.radius);
        table.attr({stroke: "none", fill: this.color, opacity: 1});

        // assert that 0 < seats number < 12
        let alpha = Math.PI * 2 / seats_number;  // the turning angle for seats
        let coef = 10;  // coefficient of length between seats and tables
        let x = (1 + 0.2 * coef / this.x) * this.x;
        let y = this.y;

        for (let i = 0; i < seats_number; i++) {

            // define some seats as unavailable
            let available = false;
            if (i%2 === 0) {
                available = true;}

            const seat = new Seat(x, y, i + 1, tables_info[this.class_type][0], this.id, available);
            const radius_coef = this.radius / seat.radius;

            let raphi = seat.initialize_raphael(paper, radius_coef);
            raphi.mouseover(function () {
                seat.mouse_over()
            });
            raphi.mouseout(function () {
                seat.mouse_out()
            });
            raphi.click(function () {
                seat.click_on()
            });

            let points = this.find_point(x, y, alpha);
            x = points[0];
            y = points[1];
        }
    }
}

class Seat extends Furniture {
    constructor(x, y, id, price, table_id, available=true, color = "#988e41", radius = 6) {
        super(x, y, color, id, radius);
        this.price = price;
        this.table_id = table_id;
        this.raphael = null;
        this.available = available;

        let self = this;
        this.myHandler = function() {self.cancel()};
    }

    initialize_raphael(paper, coefficient) {
        let color = this.color;
        if (this.available === false) {
            color = "#000000"
        }
        this.raphael = paper.circle(this.x * coefficient * this.radius, this.y * coefficient * this.radius, this.radius);
        this.raphael.attr({stroke: "none", fill: color, opacity: 0.8});
        return this.raphael;
    }

    mouse_over() {
        if (this.available !== false) {
            this.raphael.attr("opacity", .4);
        } else {
            this.raphael.attr("cursor", "not-allowed");
        }
    }

    mouse_out() {
        this.raphael.attr("opacity", .8);
    }

    click_on() {
        if (this.available === true) {
            this.available = null;  // as selected
            this.raphael.attr("fill", "#4B4D5A");

            // adding new selected seat to the list
            let ul = document.getElementById("selected-seats");
            let li = document.createElement("li");
            let b = document.createElement("b");
            let a = document.createElement("a");

            li.appendChild(document.createTextNode("Table " + this.table_id + ", seat " + this.id + ": "));
            li.setAttribute("id", this.table_id + '_' + this.id);

            b.appendChild(document.createTextNode("$" + this.price));
            li.appendChild(b);

            a.setAttribute("href", "#");
            a.appendChild(document.createTextNode(" [cancel]"));
            li.appendChild(a);
            a.onclick = this.myHandler;

            ul.appendChild(li);

            // changing total price
            let total = document.getElementById('total').innerHTML;
            document.getElementById('total').innerHTML = parseFloat(total) + this.price;

            // changing amount of selected seats
            let num_selected = document.getElementById('counter').innerHTML;
            document.getElementById('counter').innerHTML = parseInt(num_selected) + 1
        }
        else if (this.available === null){
            this.available = true;
            this.raphael.attr("fill", this.color);

            let li_id = this.table_id.toString() + '_' + this.id.toString();
            let li = document.getElementById(li_id);
            li.parentNode.removeChild(li);

            // changing total price
            let total = document.getElementById('total').innerHTML;
            document.getElementById('total').innerHTML = parseFloat(total) - this.price;

            // changing amount of selected seats
            let num_selected = document.getElementById('counter').innerHTML;
            document.getElementById('counter').innerHTML = parseInt(num_selected) - 1
        }
        else {
        }
    }
    cancel() {
        this.click_on();
        return false;
    }
}

window.onload = function () {
    let tables = [{"x": 10, "y": 5, "class_type": "high_class"},
        {"x": 10, "y": 20, "class_type": "low_class"},
        {"x": 10, "y": 35, "class_type": "low_class"},
        {"x": 40, "y": 5, "class_type": "low_class"},
        {"x": 40, "y": 20, "class_type": "high_class"},
        {"x": 40, "y": 35, "class_type": "low_class"},
        {"x": 20, "y": 12.5, "class_type": "low_class"},
        {"x": 20, "y": 27.5, "class_type": "low_class"},
        {"x": 30, "y": 12.5, "class_type": "high_class"},
        {"x": 30, "y": 27.5, "class_type": "low_class"}];  //coordinates of tables

    // Creates canvas 500 � 500 at 50, 30
    let paper = Raphael(50, 90, 900, 900);
    // paper.circle(0, 0, 10).attr({"fill": "#FFFF00"});
    // paper.circle(900, 0, 10).attr({"fill": "#FFFF00"});
    // paper.circle(900, 900, 10).attr({"fill": "#FFFF00"});
    // paper.circle(0, 900, 10).attr({"fill": "#FFFF00"});

    for (let i = 0; i < tables.length; i++) {
        let info = tables_info[tables[i].class_type];

        let table = new Table(tables[i].x, tables[i].y, i + 1, tables[i].class_type, info[1]);
        table.draw_seats(NUM_SEATS_1, paper);
    }
};

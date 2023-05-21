/**
 * @typedef DateObject
 * @prop {number} year
 * @prop {number} month
 * @prop {number} date
 * @prop {number} hour
 * @prop {number} minute
 * @prop {number} second
 * @prop {number} ms
 */

export default class Temporal{
	static SHORT = 0
	static LONG = 1

	/**@type {Date} */
	#date

	/**
	 * 
	 * @param {Date|DateObject|string|number|undefined} date 
	 */
	constructor(date){
		switch(typeof date){
			case 'undefined' : this.#date = new Date(); break
			case 'number' : 
			case 'string' : this.#date = new Date(date); break
			case 'object' : 
			if(!(date instanceof Date)){
				const { year = 1970, month = 1, _date = 1, hour = 0, minute = 0, second = 0, ms = 0} = date ?? {}
				this.#date = new Date(year, month - 1, _date, 7, 30)
				this.#date.setUTCHours(hour, minute, second)
			}
			else
				this.#date = date
			break
		}
	}

	year(v){
		let a
		return (a = this.#date[`${v ? 'set' : 'get'}UTCFullYear`](v)) && !v ? a : this
	}
	
	month(v){
		let a
		return (a = this.#date[`${v ? 'set' : 'get'}UTCMonth`](v - 1)) && !v ? a + 1: this
	}

	date(v){
		let a
		return (a = this.#date[`${v ? 'set' : 'get'}UTCDate`](v)) && !v ? a : this
	}

	hours(v){
		let a
		return (a = this.#date[`${v ? 'set' : 'get'}UTCHours`](v)) && !v ? a : this
	}

	minutes(v){
		let a
		return (a = this.#date[`${v ? 'set' : 'get'}UTCMinutes`](v)) && !v ? a : this
	}

	seconds(v){
		let a
		return (a = this.#date[`${v ? 'set' : 'get'}UTCSeconds`](v)) && !v ? a : this
	}

	milliseconds(v){
		let a
		return (a = this.#date[`${v ? 'set' : 'get'}UTCMilliseconds`](v)) && !v ? a : this
	}

	/**@param {'time'|'date'|undefined} type */
	getMs(type){
		switch(type){
			case 'time' : return (this.hours() * 60 * 60 + this.minutes() * 60 + this.seconds()) * 1000 + this.milliseconds()
			case 'date' : return this.getMs() - this.getMs('time')
			default : return this.#date.valueOf()
		}
	}

	/**
	 * 
	 * @param {Temporal.SHORT|Temporal.LONG} type 
	 * @returns 
	 */
	day(type){
		const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(e=>e.replace(/./, e=>e.toUpperCase())),
		day = this.#date.getUTCDay()
		return type === Temporal.LONG ? days[day] : days[day].substring(0, 3)
	}

	leap(){
		return !(this.year() % 4) && (!(this.year() % 400) || !!(this.year() % 100) )
	}

	lastDay(){
		return Temporal.dayInMonth(this.month(), this.year())
	}

	static dayInMonth(month, year){
		return month === 2 ? year & 3 || !(year % 25) && year & 15 ? 28 : 29 : 30 + (month + (month >> 3) & 1)
	}
}
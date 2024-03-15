class Canvas {
	canvasId = 'canvas'
	ctx = null
	width = window.innerWidth
	height = window.innerHeight
	partials = []
	partialCount = 200
	partialRadius = 5
	lineWidth = 50
	speed = 5
	colors = ['#2F4F4F', '#FF8C00', '#800080', '#BC8F8F', '#EE82EE', '#00FF00']
	mouseX = 0
	mouseY = 0
	isFirstMove = true

	constructor(
		canvasId,
		width,
		height,
		partialCount,
		partialRadius,
		lineWidth,
		speed,
		colors
	) {
		this.canvasId = canvasId ? canvasId : this.canvasId
		this.width = width ? width : this.width
		this.height = height ? height : this.height
		this.partialCount = partialCount ? partialCount : this.partialCount
		this.speed = speed ? speed : this.speed
		this.colors = colors ? colors : this.colors
		this.partialRadius = partialRadius ? partialRadius : this.partialRadius
		this.lineWidth = lineWidth ? lineWidth : this.lineWidth
	}

	createPartials() {
		for (let i = 0; i < this.partialCount; i++) {
			this.partials.push({
				x: this.width * Math.random(),
				y: this.height * Math.random(),
				r: this.partialRadius,
				sx: this.speed * Math.random(),
				sy: this.speed * Math.random(),
				color: this.colors[Math.floor(Math.random() * this.colors.length)]
			})
		}
	}

	drawCircles() {
		for (let i = 0; i < this.partials.length; i++) {
			this.ctx.beginPath()
			this.ctx.arc(
				this.partials[i].x,
				this.partials[i].y,
				this.partials[i].r,
				0,
				Math.PI * 2
			)
			this.ctx.fillStyle = this.partials[i].color
			this.ctx.fill()
		}
	}

	drawLines() {
		let x1, x2, y1, y2, length

		for (let i = 0; i < this.partials.length; i++) {
			for (let j = 0; j < this.partials.length; j++) {
				x1 = this.partials[i].x
				y1 = this.partials[i].y
				x2 = this.partials[j].x
				y2 = this.partials[j].y

				length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

				const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2)

				gradient.addColorStop(0, this.partials[i].color)
				gradient.addColorStop(0.5, this.partials[j].color)

				const opacity = Math.max(0, 1 - length / this.lineWidth)

				if (length < this.lineWidth) {
					this.ctx.globalAlpha = opacity

					this.ctx.lineWidth = this.partialRadius / 4
					this.ctx.strokeStyle = gradient
					this.ctx.beginPath()
					this.ctx.moveTo(x1, y1)
					this.ctx.lineTo(x2, y2)
					this.ctx.closePath()
					this.ctx.stroke()

					this.ctx.globalAlpha = 1
				}
			}
		}
	}

	render() {
		this.ctx.clearRect(0, 0, this.width, this.height)
		this.drawCircles()
		this.drawLines()
	}

	updatePartials() {}

	update() {
		for (let partial of this.partials) {
			if (partial.isMouse) {
				partial.x = this.mouseX
				partial.y = this.mouseY

				

			} else {

				partial.x += partial.sx
				partial.y += partial.sy

				if (partial.x > this.width || partial.x < 0) {
					partial.sx *= -1
				}

				if (partial.y > this.height || partial.y < 0) {
					partial.sy *= -1
				}
			}
		}
	}

	addMouseMoveListener() {
		const handleAddMousePartial = (event) => {
			const rect = this.ctx.canvas.getBoundingClientRect()
			this.mouseX = event.clientX - rect.left
			this.mouseY = event.clientY - rect.top

			this.isFirstMove &&
				this.partials.push({
					x: this.mouseX,
					y: this.mouseY,
					r: this.partialRadius,
					sx: this.speed * Math.random(),
					sy: this.speed * Math.random(),
					color: this.colors[Math.floor(Math.random() * this.colors.length)],
					isMouse: true
				})

			this.isFirstMove = false
		}

		document.addEventListener('mousemove', handleAddMousePartial)
	}

	run() {
		window.requestAnimationFrame(() => {
			this.update()
			this.render()
			this.run()
		})
	}

	init() {
		const canvas = document.querySelector(this.canvasId)

		this.ctx = canvas.getContext('2d')

		canvas.width = this.width
		canvas.height = this.height
	}

	start() {
		this.init()
		this.createPartials()
		this.addMouseMoveListener()
		this.run()
	}
}

window.addEventListener('load', () => {
	const canvas = new Canvas('canvas')

	canvas.start()
})

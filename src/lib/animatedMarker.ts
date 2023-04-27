import L, { LatLngExpression, Map, Marker, MarkerOptions } from 'leaflet';
import type { LatLng } from 'leaflet';

interface Options extends MarkerOptions {
	distance: number;
	interval: number;
	onEnd: () => void;
	clickable: boolean;
}

export class AnimatedMarker extends L.Marker {
  declare options: Options

  constructor(latlng: LatLngExpression, path: LatLng[], options: Options) {
    super(latlng, options)
  }

//   onAdd(map: Map) {
// 		L.Marker.prototype.onAdd.call(this, map);
// 	},
// }

L.AnimatedMarker = L.Marker.extend({
	options: {
		// meters
		distance: 200,
		// ms
		interval: 1000,
		// callback onend
		onEnd: function () {},
		clickable: false,
	},

	initialize: function (latlngs: LatLng[], options: Options) {
		this.setLine(latlngs);
		L.Marker.prototype.initialize.call(this, latlngs[0], options);
	},



	animate: function () {
		let self = this,
			len = this._latlngs.length,
			speed = this.options.interval;

		// Normalize the transition speed from vertex to vertex
		if (this._i < len && this.i > 0) {
			speed =
				(this._latlngs[this._i - 1].distanceTo(this._latlngs[this._i]) / this.options.distance) * this.options.interval;
		}

		if (this._icon) {
			this._icon.style[L.DomUtil.TRANSITION] = 'all ' + speed + 'ms linear';
		}
		if (this._shadow) {
			this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + speed + 'ms linear';
		}

		// Move to the next vertex
		this.setLatLng(this._latlngs[this._i]);
		this._i++;

		// Queue up the animation to the next next vertex
		this._tid = setTimeout(function () {
			if (self._i === len) {
				self.options.onEnd.apply(self, Array.prototype.slice.call(arguments));
			} else {
				self.animate();
			}
		}, speed);
	},

	// Start the animation
	start: function () {
		this.animate();
	},

	// Stop the animation in place
	stop: function () {
		if (this._tid) {
			clearTimeout(this._tid);
		}
	},

	setLine: function (latlngs: LatLng[]) {
		this._latlngs = latlngs;
		this._i = 0;
	},
});

L.animatedMarker = function (latlngs: LatLng[], options: Options) {
	return new L.AnimatedMarker(latlngs, options);
};

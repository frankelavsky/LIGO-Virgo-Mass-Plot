// Electromagnetic data sources: 
// NS: http://xtreme.as.arizona.edu/NeutronStars/data/pulsar_masses.dat
// BH: https://stellarcollapse.org/sites/default/files/table.pdf
// Gravitational Wave data sources are from LIGO-Virgo data releases: https://losc.ligo.org/events/

var menu_tips = {
	"view": "These options are different arrangements for the data points.",
	"toggle": "These options allow some pieces of information to be turned on or off.",
	"scale": "These options change the scale and position of the data points spatially.",
	"range": "These options zoom in or out on <b>Neutron Stars</b> or the whole view.",
	"appearance": "These options can change a lot about the look of this visualization.",
	"view_full":"The default view.",
	"view_center":"Shows the <b>Mass Gap</b> (Toggle) the best when set with <b>Radius:Equal</b> (Look).",
	"view_spread":"X-axis positions are equally distributed, which can help show distribution. <b>Radius:Equal</b> (Look) helps here too.",
	"view_split":"Same as <b>Spread</b> view, but divided by <i>Black Holes</i> and <i>Neutron Stars</i>",
	"view_cat_one":"A view of only <i>Black Holes</i> and their types: Galatic (in our galaxy) or not. You can turn <i>Neutron Stars</i> back on in the <b>Toggle</b> menu.",
	"view_cat_two":"A zoomed-in view of only <i>Neutron Stars</i> and their types. You can <b>Zoom</b> back out and also turn <i>Black Holes</i> back on in the <b>Toggle</b> menu.",
	"toggle_bh":"Toggles <i>Black Holes</i>.",
	"toggle_ns":"Toggles <i>Neutron Stars</i>.",
	"toggle_title":"Toggles the title.",
	"toggle_labels":"Toggles labels, which are on the <b>Categories</b> and <b>Full</b> views.",
	"toggle_axis":"Toggles the axis.",
	"toggle_merger":"Toggles the arrows for the LIGO-Virgo merger events.",
	"toggle_bh_error":"(Scientific) Toggles the error bars for BH data.",
	"toggle_ns_error":"(Scientific) Toggles the error bars for NS data.",
	"toggle_gap":"(Scientific) Toggles the <i>Mass Gap</i>, an issue of debate among scientists. With error bars, it seems plausible (though unlikely) that there is a gradient of masses between Neutron Stars and Black Holes. Without these, it seems as though expired stellar bodies do not compact in this mass range.",
	"log_scale":"(Scientific) This scale distributes data at lower values with more room, while higher values are closer together.",
	"lin_scale":"A linear scale with this data causes the <i>Neutron Stars</i> to bunch together while the <i>Black Holes</i> gain more room.",
	"full_range":"Shows whole range.",
	"ns_range":"Zooms in on <b>Neutron Star</b> range.",
	"scheme":"The <b>Dark</b> scheme looks more striking and astronomical, but the <b>Light</b> option is great if you use the <b>Save Image</b> option for a publication.",
	"radius":"(Scientific) With <b>Scale</b>, the radius of the data points are scaled to mass. Setting radius to <b>Equal</b> makes them all the same size - nice for scientific purposes or to make a little room.",
	"shading":"<b>Stellar</b> will show each object with an artistic rendition: holes or spheres. But <b>Plain</b> simply makes all the data points flat.",
	"color":"This option is most noticable if objects/error bars overlap. <b>Blend</b> lightens areas of overlap, making them easier to see. But for a cleaner look, try <b>None</b>",
	"order":"This option only matters if <b>Color-mode</b> is set to <b>Plain</b>, as it determines whether error bars or data points are in front."
}

var preset_data = [
	/*{
		"mass": 2.631,
		"category": "Recycled Pulsar",
		"raw_name": "J1748-2021B",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 2.127,
		"error_high": 2.893,
		"target_x": 1131788407251
	},*/
	{
		"mass": 1.928,
		"category": "Recycled Pulsar",
		"raw_name": "J1614-2230",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.921,
		"error_high": 1.9349999999999998,
		"display_name": "J1614-2230",
		"target_x": 1002.6823583406873
	},
	{
		"mass": 1.24,
		"category": "Recycled Pulsar",
		"raw_name": "J1802-2124",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.13,
		"error_high": 1.35,
		"display_name": "J1802-2124",
		"target_x": 564.0687050447522
	},
	{
		"mass": 10.1,
		"category": "Galactic",
		"raw_name": "XTE J1819-254",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 8.7,
		"error_high": 11.7,
		"display_name": "XTE J1819-254",
		"target_x": 1071.2539849121217
	},
	{
		"mass": 7,
		"category": "Extragalactic",
		"raw_name": "GW170608b",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 5,
		"error_high": 9,
		"display_name": "GW170608-B",
		"target_x": 812.5614186465721
	},
	{
		"mass": 1.4398,
		"category": "DNS",
		"raw_name": "B1913+16",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.4396,
		"error_high": 1.44,
		"display_name": "B1913+16",
		"target_x": 348.03313882891666
	},
	{
		"mass": 1.073,
		"category": "Slow Pulsar",
		"raw_name": "Her X-1",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.715,
		"error_high": 1.431,
		"display_name": "Her X-1",
		"target_x": 1085.7613664439148
	},
	{
		"mass": 1.238,
		"category": "Recycled Pulsar",
		"raw_name": "B1802-07",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.728,
		"error_high": 1.35,
		"display_name": "B1802-07",
		"target_x": 515.3242697716094
	},
	{
		"mass": 1.91,
		"category": "Slow Pulsar",
		"raw_name": "EXO 1722-363",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.46,
		"error_high": 2.36,
		"display_name": "EXO 1722-363",
		"target_x": 557.0042521720869
	},
	{
		"mass": 1.478,
		"category": "DNS",
		"raw_name": "J1811-1736",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.768,
		"error_high": 1.615,
		"display_name": "J1811-1736",
		"target_x": 1134.8318269196056
	},
	{
		"mass": 1.393,
		"category": "Recycled Pulsar",
		"raw_name": "J2234+0611",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3800000000000001,
		"error_high": 1.406,
		"display_name": "J2234+0611",
		"target_x": 1408.1052805075572
	},
	{
		"mass": 12,
		"category": "Galactic",
		"raw_name": "GS2023+338",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 10,
		"error_high": 14,
		"display_name": "GS2023+338",
		"target_x": 1246.781459274416
	},
	{
		"mass": 1.31,
		"category": "Recycled Pulsar",
		"raw_name": "J1713+0747",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.2,
		"error_high": 1.4200000000000002,
		"display_name": "J1713+0747",
		"target_x": 440.7710821615681
	},
	{
		"mass": 55.9,
		"category": "Extragalactic",
		"raw_name": "GW170814",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 53.199999999999996,
		"error_high": 59.3,
		"display_name": "GW170814",
		"target_x": 1297.1908952299987
	},
	{
		"mass": 19.4,
		"category": "Extragalactic",
		"raw_name": "GW170104b",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 13.499999999999998,
		"error_high": 24.7,
		"display_name": "GW170104-B",
		"target_x": 433.86294177907064
	},
	{
		"mass": 25.3,
		"category": "Extragalactic",
		"raw_name": "GW170814b",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 21.1,
		"error_high": 28.1,
		"display_name": "GW170814-B",
		"target_x": 1215.2139219207702
	},
	{
		"mass": 12.9,
		"category": "Galactic",
		"raw_name": "GRS1915+105",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 10.5,
		"error_high": 15.3,
		"display_name": "GRS1915+105",
		"target_x": 367.9221660905039
	},
	{
		"mass": 1.354,
		"category": "DNS",
		"raw_name": "B2127+11Cc",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.344,
		"error_high": 1.364,
		"display_name": "B2127+11Cc",
		"target_x": 1209.9423147435562
	},
	{
		"mass": 1.965,
		"category": "Recycled Pulsar",
		"raw_name": "B1516+02B",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.467,
		"error_high": 2.208,
		"display_name": "B1516+02B",
		"target_x": 394.2285496225858
	},
	{
		"mass": 0.951,
		"category": "DNS",
		"raw_name": "J1518+4904c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.95,
		"error_high": 1.946,
		"display_name": "J1518+4904c",
		"target_x": 490.95554262012786
	},
	{
		"mass": 7.5,
		"category": "Extragalactic",
		"raw_name": "GW151226b",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 5.2,
		"error_high": 9.8,
		"display_name": "GW151226-B",
		"target_x": 729.237240735018
	},
	{
		"mass": 1.766,
		"category": "DNS",
		"raw_name": "J1518+4904",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.775,
		"error_high": 1.769,
		"display_name": "J1518+4904",
		"target_x": 1176.8570444341929
	},
	{
		"mass": 1.3384,
		"category": "DNS",
		"raw_name": "PSR J1757−1854a",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.33831,
		"error_high": 1.33849,
		"display_name": "PSR J1757−1854-A",
		"target_x": 140.12293063460584
	},
	{
		"mass": 6.9,
		"category": "Galactic",
		"raw_name": "XTE J1118+480",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 6.95,
		"error_high": 8.15,
		"display_name": "XTE J1118+480",
		"target_x": 1052.875154976098
	},
	{
		"mass": 5,
		"category": "Galactic",
		"raw_name": "4U 1543-47",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 2.5,
		"error_high": 7.5,
		"display_name": "4U 1543-47",
		"target_x": 966.2019988641862
	},
	{
		"mass": 1.83,
		"category": "Recycled Pulsar",
		"raw_name": "J1012+5307",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.72,
		"error_high": 1.9400000000000002,
		"display_name": "J1012+5307",
		"target_x": 678.2747568142807
	},
	{
		"mass": 5.31,
		"category": "Galactic",
		"raw_name": "GRO J1655-40",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 5.239999999999999,
		"error_high": 5.38,
		"display_name": "GRO J1655-40",
		"target_x": 511.03432689111173
	},
	{
		"mass": 1.47,
		"category": "Recycled Pulsar",
		"raw_name": "J1909-3744",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.44,
		"error_high": 1.5,
		"display_name": "J1909-3744",
		"target_x": 627.5194302345711
	},
	{
		"mass": 1.291,
		"category": "DNS",
		"raw_name": "J1906+0746",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.28,
		"error_high": 1.3019999999999998,
		"display_name": "J1906+0746",
		"target_x": 964.1557745944232
	},
	{
		"mass": 1.61,
		"category": "Burster",
		"raw_name": "KS 1731-260",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.2400000000000002,
		"error_high": 1.96,
		"display_name": "KS 1731-260",
		"target_x": 1063.3571413179134
	},
	{
		"mass": 1.02,
		"category": "Slow Pulsar",
		"raw_name": "4U 1538-52",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.85,
		"error_high": 1.19,
		"display_name": "4U 1538-52",
		"target_x": 557.410910531048
	},
	{
		"mass": 2.74,
		"category": "DNS",
		"raw_name": "GW170817",
		"type": "L_NS",
		"messenger": "Gravitational Wave",
		"special": true,
		"error_low": 2.7300000000000004,
		"error_high": 2.7800000000000002,
		"display_name": "GW170817",
		"target_x": 773.1913706862914
	},
	{
		"mass": 18,
		"category": "Extragalactic",
		"raw_name": "GW170608",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 17.1,
		"error_high": 22.8,
		"display_name": "GW170608",
		"target_x": 871.0042446352232
	},
	{
		"mass": 1.72,
		"category": "Recycled Pulsar",
		"raw_name": "J0751+1807",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.65,
		"error_high": 1.79,
		"display_name": "J0751+1807",
		"target_x": 504.9914293151462
	},
	{
		"mass": 1.265,
		"category": "DNS",
		"raw_name": "GW170817b",
		"type": "L_NS",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 1.17,
		"error_high": 1.3599999999999999,
		"display_name": "GW170817-B",
		"target_x": 726.7152021531266
	},
	{
		"mass": 36,
		"category": "Extragalactic",
		"raw_name": "GW150914a",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 32,
		"error_high": 41,
		"display_name": "GW150914-A",
		"target_x": 658.6964173476744
	},
	{
		"mass": 10.5,
		"category": "Galactic",
		"raw_name": "XTE J1550-564",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 9.5,
		"error_high": 11.5,
		"display_name": "XTE J1550-564",
		"target_x": 1142.2197060010221
	},
	{
		"mass": 7.6,
		"category": "Galactic",
		"raw_name": "GS 1354-64",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 6.8999999999999995,
		"error_high": 8.299999999999999,
		"display_name": "GS 1354-64",
		"target_x": 605.034036762887
	},
	{
		"mass": 4.9,
		"category": "Galactic",
		"raw_name": "GRS 1716-249",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": true,
		"error_low": 4.9,
		"error_high": 80,
		"display_name": "GRS 1716-249",
		"target_x": 560.7827432091573
	},
	{
		"mass": 1.3655,
		"category": "Recycled Pulsar",
		"raw_name": "J1807-2500B",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3634,
		"error_high": 1.3676,
		"display_name": "J1807-2500B",
		"target_x": 1187.832802193812
	},
	{
		"mass": 1.74,
		"category": "Slow Pulsar",
		"raw_name": "OAO 1657-415",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.44,
		"error_high": 2.04,
		"display_name": "OAO 1657-415",
		"target_x": 441.6703359344865
	},
	{
		"mass": 1.667,
		"category": "Recycled Pulsar",
		"raw_name": "J1903+0327",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.6460000000000001,
		"error_high": 1.688,
		"display_name": "J1903+0327",
		"target_x": 647.2513675372854
	},
	{
		"mass": 14.2,
		"category": "Extragalactic",
		"raw_name": "GW151226a",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 10.5,
		"error_high": 22.5,
		"display_name": "GW151226-A",
		"target_x": 586.8586232581881
	},
	{
		"mass": 1.322,
		"category": "DNS",
		"raw_name": "J1906+0746c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3110000000000002,
		"error_high": 1.333,
		"display_name": "J1906+0746c",
		"target_x": 1361.964268790772
	},
	{
		"mass": 1.559,
		"category": "DNS",
		"raw_name": "J0453+1559",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.554,
		"error_high": 1.5639999999999998,
		"display_name": "J0453+1559",
		"target_x": 1007.3298804865215
	},
	{
		"mass": 1.56,
		"category": "Burster",
		"raw_name": "CygX-2",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.415,
		"error_high": 2.089,
		"display_name": "CygX-2",
		"target_x": 1218.8126798852727
	},
	{
		"mass": 1.877,
		"category": "Recycled Pulsar",
		"raw_name": "J1748-2446I",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.342,
		"error_high": 1.919,
		"display_name": "J1748-2446I",
		"target_x": 1329.681268230483
	},
	{
		"mass": 1.41,
		"category": "Slow Pulsar",
		"raw_name": "XTE J1855-026",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.17,
		"error_high": 1.65,
		"display_name": "XTE J1855-026",
		"target_x": 205.3852263875446
	},
	{
		"mass": 1.58,
		"category": "Recycled Pulsar",
		"raw_name": "B1855+09",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.4500000000000002,
		"error_high": 1.6800000000000002,
		"display_name": "B1855+09",
		"target_x": 918.1840708428078
	},
	{
		"mass": 23,
		"category": "Extragalactic",
		"raw_name": "LVT151012a",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 17,
		"error_high": 41,
		"display_name": "LVT151012-A",
		"target_x": 1135.700583894334
	},
	{
		"mass": 8.5,
		"category": "Galactic",
		"raw_name": "GRS 1009-45",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 8.5,
		"error_high": 8.5,
		"display_name": "GRS 1009-45",
		"target_x": 396.85139928906995
	},
	{
		"mass": 1.363,
		"category": "DNS",
		"raw_name": "J1930-1852c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.329,
		"error_high": 2.194,
		"display_name": "J1930-1852c",
		"target_x": 978.1652391295175
	},
	{
		"mass": 1.174,
		"category": "DNS",
		"raw_name": "J0453+1559c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.17,
		"error_high": 1.178,
		"display_name": "J0453+1559c",
		"target_x": 1011.7529510560705
	},
	{
		"mass": 1.48,
		"category": "DNS",
		"raw_name": "GW170817a",
		"type": "L_NS",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 1.3599999999999999,
		"error_high": 1.6,
		"display_name": "GW170817-A",
		"target_x": 836.0054746390897
	},
	{
		"mass": 20,
		"category": "Extragalactic",
		"raw_name": "NGC 300 X-1",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 16,
		"error_high": 24,
		"display_name": "NGC 300 X-1",
		"target_x": 1450.5861576894238
	},
	{
		"mass": 50.7,
		"category": "Extragalactic",
		"raw_name": "GW170104",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 46.1,
		"error_high": 56.400000000000006,
		"display_name": "GW170104",
		"target_x": 347.07567103856235
	},
	{
		"mass": 1.2,
		"category": "Recycled Pulsar",
		"raw_name": "J2222-0137",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.06,
		"error_high": 1.3399999999999999,
		"display_name": "J2222-0137",
		"target_x": 372.21061416318463
	},
	{
		"mass": 10.4,
		"category": "Galactic",
		"raw_name": "GRO J0422+32",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 10.4,
		"error_high": 10.4,
		"display_name": "GRO J0422+32",
		"target_x": 549.0841098562247
	},
	{
		"mass": 1.57,
		"category": "Burster",
		"raw_name": "4U 1608-52",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.28,
		"error_high": 1.87,
		"display_name": "4U 1608-52",
		"target_x": 609.4722303346535
	},
	{
		"mass": 1.4378,
		"category": "Recycled Pulsar",
		"raw_name": "J0337+1715",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.4364999999999999,
		"error_high": 1.4391,
		"display_name": "J0337+1715",
		"target_x": 523.9671366726868
	},
	{
		"mass": 5.5,
		"category": "Galactic",
		"raw_name": "H1705-25",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 4.95,
		"error_high": 8,
		"display_name": "H1705-25",
		"target_x": 1016.1734282088639
	},
	{
		"mass": 1.3,
		"category": "Recycled Pulsar",
		"raw_name": "J1910-5958A",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.1,
		"error_high": 1.5,
		"display_name": "J1910-5958A",
		"target_x": 995.473835655823
	},
	{
		"mass": 1.81,
		"category": "Burster",
		"raw_name": "SAX J1748.9-2021",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.44,
		"error_high": 2.06,
		"display_name": "SAX J1748.9-2021",
		"target_x": 1096.968307175464
	},
	{
		"mass": 15.65,
		"category": "Extragalactic",
		"raw_name": "M33 X-7",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 14.200000000000001,
		"error_high": 17.1,
		"display_name": "M33 X-7",
		"target_x": 1312.6629479361297
	},
	{
		"mass": 31.2,
		"category": "Extragalactic",
		"raw_name": "GW170104a",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 25.2,
		"error_high": 39.6,
		"display_name": "GW170104-A",
		"target_x": 241.68780384674795
	},
	{
		"mass": 35,
		"category": "Extragalactic",
		"raw_name": "LVT151012",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 31,
		"error_high": 48,
		"display_name": "LVT151012",
		"target_x": 1061.7598526618838
	},
	{
		"mass": 23.1,
		"category": "Extragalactic",
		"raw_name": "IC 10 X-1",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 23.1,
		"error_high": 80,
		"display_name": "IC 10 X-1",
		"target_x": 133.85260576014772
	},
	{
		"mass": 1.2489,
		"category": "DNS",
		"raw_name": "J0737-3039B",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.2482,
		"error_high": 1.2495999999999998,
		"display_name": "J0737-3039B",
		"target_x": 408.3130561025299
	},
	{
		"mass": 1.468,
		"category": "Recycled Pulsar",
		"raw_name": "J0514-4002A",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.202,
		"error_high": 1.488,
		"display_name": "J0514-4002A",
		"target_x": 1276.9664058440676
	},
	{
		"mass": 7,
		"category": "Extragalactic",
		"raw_name": "LMC X-3",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 6.68,
		"error_high": 7.32,
		"display_name": "LMC X-3",
		"target_x": 492.1645183166672
	},
	{
		"mass": 13,
		"category": "Extragalactic",
		"raw_name": "LVT151012b",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 8,
		"error_high": 17,
		"display_name": "LVT151012-B",
		"target_x": 999.5700572715295
	},
	{
		"mass": 1.77,
		"category": "Burster",
		"raw_name": "4U 1820-30",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.49,
		"error_high": 2.02,
		"display_name": "4U 1820-30",
		"target_x": 938.9413672360639
	},
	{
		"mass": 1.3946,
		"category": "DNS",
		"raw_name": "PSR J1757−1854b",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.39451,
		"error_high": 1.39469,
		"display_name": "PSR J1757−1854-B",
		"target_x": 77.3225
	},
	{
		"mass": 1.341,
		"category": "DNS",
		"raw_name": "J1756-2251",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.334,
		"error_high": 1.3479999999999999,
		"display_name": "J1756-2251",
		"target_x": 1160.748952259239
	},
	{
		"mass": 2.01,
		"category": "Recycled Pulsar",
		"raw_name": "J0348+0432",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.9699999999999998,
		"error_high": 2.05,
		"display_name": "J0348+0432",
		"target_x": 656.2632680092202
	},
	{
		"mass": 1.343,
		"category": "Recycled Pulsar",
		"raw_name": "J1824-2452C",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.7959999999999999,
		"error_high": 1.3619999999999999,
		"display_name": "J1824-2452C",
		"target_x": 541.7434993069483
	},
	{
		"mass": 1.384,
		"category": "Recycled Pulsar",
		"raw_name": "J0024-7204H",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.8699999999999999,
		"error_high": 1.4629999999999999,
		"display_name": "J0024-7204H",
		"target_x": 1021.661093587554
	},
	{
		"mass": 20.8,
		"category": "Extragalactic",
		"raw_name": "GW151226",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 19.1,
		"error_high": 26.700000000000003,
		"display_name": "GW151226",
		"target_x": 657.0025879053356
	},
	{
		"mass": 6.95,
		"category": "Galactic",
		"raw_name": "GRS 1124-68",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 6.3500000000000005,
		"error_high": 7.55,
		"display_name": "GRS 1124-68",
		"target_x": 656.3559880526225
	},
	{
		"mass": 1.23,
		"category": "DNS",
		"raw_name": "J1756-2251c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.223,
		"error_high": 1.2369999999999999,
		"display_name": "J1756-2251c",
		"target_x": 1074.322784672265
	},
	{
		"mass": 1.3381,
		"category": "DNS",
		"raw_name": "J0737-3039A",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3374000000000001,
		"error_high": 1.3388,
		"display_name": "J0737-3039A",
		"target_x": 908.9564342793576
	},
	{
		"mass": 1.298,
		"category": "DNS",
		"raw_name": "J1829+2456",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.45500000000000007,
		"error_high": 1.332,
		"display_name": "J1829+2456",
		"target_x": 1103.8370064433657
	},
	{
		"mass": 62,
		"category": "Extragalactic",
		"raw_name": "GW150914",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 58,
		"error_high": 66,
		"display_name": "GW150914",
		"target_x": 757.769050809669
	},
	{
		"mass": 1.57,
		"category": "Slow Pulsar",
		"raw_name": "LMC X-4",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.46,
		"error_high": 1.6800000000000002,
		"display_name": "LMC X-4",
		"target_x": 420.7971290746466
	},
	{
		"mass": 1.273,
		"category": "DNS",
		"raw_name": "J1829+2456c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.254,
		"error_high": 2.145,
		"display_name": "J1829+2456c",
		"target_x": 928.6420601952663
	},
	{
		"mass": 5.1,
		"category": "Galactic",
		"raw_name": "XTE J1650-50 0 ",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 5.1,
		"error_high": 5.1,
		"display_name": "XTE J1650-50 0 ",
		"target_x": 625.167690637687
	},
	{
		"mass": 1.57,
		"category": "Slow Pulsar",
		"raw_name": "Cen X-3",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.4100000000000001,
		"error_high": 1.73,
		"display_name": "Cen X-3",
		"target_x": 695.3455543696937
	},
	{
		"mass": 1.358,
		"category": "DNS",
		"raw_name": "B2127+11C",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.348,
		"error_high": 1.368,
		"display_name": "B2127+11C",
		"target_x": 676.0174989293602
	},
	{
		"mass": 6.6,
		"category": "Galactic",
		"raw_name": "A0620-00",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 6.35,
		"error_high": 6.85,
		"display_name": "A0620-00",
		"target_x": 940.4789179803449
	},
	{
		"mass": 10.91,
		"category": "Extragalactic",
		"raw_name": "LMC X-1",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 9.36,
		"error_high": 12.46,
		"display_name": "LMC X-1",
		"target_x": 479.30286078683565
	},
	{
		"mass": 30.5,
		"category": "Extragalactic",
		"raw_name": "GW170814a",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 27.5,
		"error_high": 36.2,
		"display_name": "GW170814-A",
		"target_x": 1380.7801073954474
	},
	{
		"mass": 14.8,
		"category": "Galactic",
		"raw_name": "CygX-1",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 14.700000000000001,
		"error_high": 14.9,
		"display_name": "CygX-1",
		"target_x": 264.8220535761846
	},
	{
		"mass": 1.199,
		"category": "DNS",
		"raw_name": "J1930-1852",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.40900000000000003,
		"error_high": 1.258,
		"display_name": "J1930-1852",
		"target_x": 282.19373071724215
	},
	{
		"mass": 1.3886,
		"category": "DNS",
		"raw_name": "B1913+16c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3884,
		"error_high": 1.3888,
		"display_name": "B1913+16c",
		"target_x": 596.8541664635259
	},
	{
		"mass": 1.44,
		"category": "Recycled Pulsar",
		"raw_name": "J0437-4715",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3699999999999999,
		"error_high": 1.51,
		"display_name": "J0437-4715",
		"target_x": 875.1083734234534
	},
	{
		"mass": 7,
		"category": "Galactic",
		"raw_name": "GX339-4",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 7,
		"error_high": 80,
		"display_name": "GX339-4",
		"target_x": 1103.9548256579149
	},
	{
		"mass": 1.3455,
		"category": "DNS",
		"raw_name": "B1534+12c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3451,
		"error_high": 1.3458999999999999,
		"display_name": "B1534+12c",
		"target_x": 1469.1275
	},
	{
		"mass": 1.27,
		"category": "Slow Pulsar",
		"raw_name": "J1141-6545",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.26,
		"error_high": 1.28,
		"display_name": "J1141-6545",
		"target_x": 242.03435234885958
	},
	{
		"mass": 1.65,
		"category": "Burster",
		"raw_name": "EXO 1745-248",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3399999999999999,
		"error_high": 1.8599999999999999,
		"display_name": "EXO 1745-248",
		"target_x": 1390.506501337101
	},
	{
		"mass": 1.002,
		"category": "DNS",
		"raw_name": "J1811-1736c",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.946,
		"error_high": 1.874,
		"display_name": "J1811-1736c",
		"target_x": 1035.5965734791123
	},
	{
		"mass": 1.47,
		"category": "Recycled Pulsar",
		"raw_name": "J1738+0333",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.41,
		"error_high": 1.54,
		"display_name": "J1738+0333",
		"target_x": 1312.7451106118726
	},
	{
		"mass": 1.57,
		"category": "Slow Pulsar",
		"raw_name": "SAX J1802.7-2017",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.32,
		"error_high": 1.82,
		"display_name": "SAX J1802.7-2017",
		"target_x": 892.3126119155154
	},
	{
		"mass": 1.367,
		"category": "Slow Pulsar",
		"raw_name": "B2303+46",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.274,
		"error_high": 1.425,
		"display_name": "B2303+46",
		"target_x": 1247.3058605241465
	},
	{
		"mass": 12,
		"category": "Extragalactic",
		"raw_name": "GW170608a",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 10,
		"error_high": 19,
		"display_name": "GW170608-A",
		"target_x": 932.4817666878157
	},
	{
		"mass": 1.832,
		"category": "Recycled Pulsar",
		"raw_name": "J1946+3417",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.804,
		"error_high": 1.86,
		"display_name": "J1946+3417",
		"target_x": 1148.371019719255
	},
	{
		"mass": 6.55,
		"category": "Galactic",
		"raw_name": "GS 2000+25",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 6.55,
		"error_high": 6.55,
		"display_name": "GS 2000+25",
		"target_x": 571.5838420532158
	},
	{
		"mass": 1.9,
		"category": "Burster",
		"raw_name": "4U 1724-207",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.5499999999999998,
		"error_high": 2.12,
		"display_name": "4U 1724-207",
		"target_x": 303.15035889435757
	},
	{
		"mass": 1.21,
		"category": "Slow Pulsar",
		"raw_name": "SMC X-1",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.0899999999999999,
		"error_high": 1.33,
		"display_name": "SMC X-1",
		"target_x": 467.9700150615504
	},
	{
		"mass": 29,
		"category": "Extragalactic",
		"raw_name": "GW150914b",
		"type": "L_BH",
		"messenger": "Gravitational Wave",
		"special": false,
		"error_low": 25,
		"error_high": 33,
		"display_name": "GW150914-B",
		"target_x": 847.3709627504057
	},
	{
		"mass": 7.7,
		"category": "Galactic",
		"raw_name": "XTE J1859+226",
		"type": "BH",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 6.4,
		"error_high": 9,
		"display_name": "XTE J1859+226",
		"target_x": 1203.032922950606
	},
	{
		"mass": 1.333,
		"category": "DNS",
		"raw_name": "B1534+12",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.3326,
		"error_high": 1.3334,
		"display_name": "B1534+12",
		"target_x": 648.8826542470107
	},
	{
		"mass": 2.12,
		"category": "Slow Pulsar",
		"raw_name": "Vela X-1",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.9600000000000002,
		"error_high": 2.2800000000000002,
		"display_name": "Vel-A X-1",
		"target_x": 616.1214295048674
	},
	{
		"mass": 1.199,
		"category": "Recycled Pulsar",
		"raw_name": "J1750-37A",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 0.802,
		"error_high": 1.37,
		"display_name": "J1750-37A",
		"target_x": 1228.0058001340788
	},
	{
		"mass": 1.53,
		"category": "Recycled Pulsar",
		"raw_name": "J0621+1002",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.33,
		"error_high": 1.6300000000000001,
		"display_name": "J0621+1002",
		"target_x": 953.69000008229
	},
	{
		"mass": 1.733,
		"category": "Recycled Pulsar",
		"raw_name": "J1748-2446J",
		"type": "NS",
		"messenger": "Electromagnetic",
		"special": false,
		"error_low": 1.235,
		"error_high": 1.806,
		"display_name": "J1748-2446J",
		"target_x": 580.9543518614729
	}
]
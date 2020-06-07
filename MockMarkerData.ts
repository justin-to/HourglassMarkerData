// college data
const CollegeData = {
  type: 'FeatureCollection',
  name: 'College Graduation Rate',
  vintage: '2020',
  source: 'collegetuitioncompare.com',
  features: [
    [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [35.305, -120.6625]
        },
        properties: {
          name: 'Cal Poly, SLO',
          value: '82%'
        }
      }
    ],
    [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [35.3292, -120.7401]
        },
        properties: {
          name: 'Cuesta College',
          value: '33%'
        }
      }
    ],
    [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [34.9446, -120.4189]
        },
        properties: {
          name: 'Allan Hancock College',
          value: '33%'
        }
      }
    ]
  ]
};

// high school data
const HighSchoolData = {
  type: 'FeatureCollection',
  name: 'High School Graduation Rate',
  vintage: '2020',
  source: 'publicschoolreview.com',
  features: [
    [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [35.2829, -120.6517]
        },
        properties: {
          name: 'San Luis Obispo High School',
          value: '97%'
        }
      }
    ],
    [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [35.1161, -120.5806]
        },
        properties: {
          name: 'Arroyo Grande High School',
          value: '95%'
        }
      }
    ],
    [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [35.2901, -120.4017]
        },
        properties: {
          name: 'Atascadero High School',
          value: '95%'
        }
      }
    ]
  ]
};

module.exports = [CollegeData, HighSchoolData];

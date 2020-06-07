var markerData = require("./MockMarkerData.ts");
const { Pool } = require("pg");

const getPool = () => new Pool({
    host: "hourglass-dev.cqg13raeiolw.us-east-2.rds.amazonaws.com",
    database: "postgres",
    user: "postgres",
    password: "WU*m6^tz4BPy"
})

const createDatasetTable = (tableName) => `
    CREATE TABLE IF NOT EXISTS datasets.${tableName} (
        geo_name text primary key,
        value decimal,
        year int
    )
`

const percentStringToDecimal = (percentString) => {
    var newString = '.' + percentString;
    return parseFloat(newString);
}

/* Following is for College Data */
const insertCollegeTable = (tableName, markerData, decimalVal, index) => `
    INSERT INTO datasets.${tableName} (
        geo_name,
        value,
        year
    )
    VALUES (
        '${markerData[0].features[index][0].properties.name}',
        '${decimalVal}',
        '${markerData[0].vintage}'
    )
    ON CONFLICT DO NOTHING
`

// This is what Girl Alex wants to do 
// const insertCollegeTable = (tableName, markerData, index) => `
//     INSERT INTO datasets.${tableName} (
//         geo_name,
//         value,
//         year,
//         longitude,
//         latitude
//     )
//     VALUES (
//         '${markerData[0].features[index][0].properties.name}',
//         '${markerData[0].features[index][0].properties.value}',
//         '${markerData[0].vintage}',
//         '${markerData[0].features[index][0].geometry.coordinates[1]}',
//         '${markerData[0].features[index][0].geometry.coordinates[0]}'
        
//     )
//     ON CONFLICT DO NOTHING
// `

const insertMetaDataRowCollege = (tableName) => `
    INSERT INTO public.dataset_meta_data (
        table_name,
        column_names,
        data_types,
        geo_type
    )
    VALUES (
        '${tableName}',
        '{"geo_name", "value", "year"}',
        '{"text", "decimal", "int"}',
        'location'
    )
    ON CONFLICT DO NOTHING
`

const insertLocationRowCollege = (markerData, index, pointID) => `
    INSERT INTO public.location (
        name,
        point_id
    )
    VALUES (
        '${markerData[0].features[index][0].properties.name}',
        ${pointID}
    )
    ON CONFLICT DO NOTHING
`

const insertPointRowCollege = (markerData, index) => `
    INSERT INTO public.point (
        latitude,
        longitude
    )
    VALUES (
        ${markerData[0].features[index][0].geometry.coordinates[0]},
        ${markerData[0].features[index][0].geometry.coordinates[1]}
    )
    RETURNING *
`

/* Following is for HighSchool Data */
const insertHighSchoolTable = (tableName, markerData, decimalVal, index) => `
    INSERT INTO datasets.${tableName} (
        geo_name,
        value,
        year
    )
    VALUES (
        '${markerData[1].features[index][0].properties.name}',
        '${decimalVal}',
        '${markerData[1].vintage}'
    )
    ON CONFLICT DO NOTHING
`

const insertMetaDataRowHighSchool = (tableName) => `
    INSERT INTO public.dataset_meta_data (
        table_name,
        column_names,
        data_types,
        geo_type
    )
    VALUES (
        '${tableName}',
        '{"geo_name", "value", "year"}',
        '{"text", "decimal", "int"}',
        'location'
    )
    ON CONFLICT DO NOTHING
`

const insertLocationRowHighSchool = (markerData, index, pointID) => `
    INSERT INTO public.location (
        name,
        point_id
    )
    VALUES (
        '${markerData[1].features[index][0].properties.name}',
        ${pointID}
    )
    ON CONFLICT DO NOTHING
`

const insertPointRowHighSchool = (markerData, index) => `
    INSERT INTO public.point (
        latitude,
        longitude
    )
    VALUES (
        ${markerData[1].features[index][0].geometry.coordinates[0]},
        ${markerData[1].features[index][0].geometry.coordinates[1]}
    )
    RETURNING *
`

const createTables = async function() {
    const pool = getPool();
    var collegeTableName = "college_graduation_rate";
    var highTableName = "highschool_graduation_rate";

    await pool.query(createDatasetTable(collegeTableName));
    await pool.query(insertMetaDataRowCollege(collegeTableName));
    
    for (let index = 0; index < markerData[0].features.length; index++ ) {
        let currPnt, result;
        let latitude = markerData[0].features[index][0].geometry.coordinates[0];
        let longitude = markerData[0].features[index][0].geometry.coordinates[1];
        let percent = percentStringToDecimal(markerData[0].features[index][0].properties.value);

        await pool.query(insertCollegeTable(collegeTableName, markerData, percent, index));
        await pool.query(insertPointRowCollege(markerData, index));
        result = await pool.query('SELECT id FROM point where latitude = $1 and longitude = $2', 
         [latitude, longitude]);
        currPnt = result.rows[0].id;
        await pool.query(insertLocationRowCollege(markerData, index, currPnt));
    } 
    
    await pool.query(createDatasetTable(highTableName));
    await pool.query(insertMetaDataRowHighSchool(highTableName));
    for (let index = 0; index < markerData[0].features.length; index++ ) {
        let currPnt, result;
        let latitude = markerData[1].features[index][0].geometry.coordinates[0];
        let longitude = markerData[1].features[index][0].geometry.coordinates[1];
        let percent = percentStringToDecimal(markerData[1].features[index][0].properties.value);

        await pool.query(insertHighSchoolTable(highTableName, markerData, percent, index));
        await pool.query(insertPointRowHighSchool(markerData, index));
        result = await pool.query('SELECT id FROM point where latitude = $1 and longitude = $2', 
         [latitude, longitude]);
        currPnt = result.rows[0].id;
        await pool.query(insertLocationRowHighSchool(markerData, index, currPnt));
    } 

    pool.end() 
}  

createTables();
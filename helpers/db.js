var mysql = require('promise-mysql');

var connection_params = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    timezone : process.env.DB_TIMEZONE,
};

console.log('==========', connection_params);
var connection;
mysql.createConnection(connection_params)
.then(conn => {    
    connection = conn;
    console.log("Created db connection successfully");
})
.catch(err => {
    console.log("Failed to create db connection", err)
});

async function isUserExist(userDetails){
    let email = userDetails.email || null;
    isUserExist_query = `SELECT id, first_name, email, phone FROM user
                         WHERE email='${email}'`;   
    return await connection.query(isUserExist_query);    
}

async function getUserDetails(email){    
    console.log('email is', email);
    isUserExistQuery = `SELECT id, first_name, last_name, email, phone, DOB, gender, role FROM user
                         WHERE email='${email}'`;                         
    return await connection.query(isUserExistQuery);    
}

async function getAllUserDetails(){
    allUsersQuery = `SELECT id, first_name, last_name, email, phone, DOB, gender, role FROM user`;
    return await connection.query(allUsersQuery);
}

async function addNewUser(userDetails){
    let first_name = userDetails.first_name || null,
        last_name = userDetails.last_name || null,
        phone = userDetails.phone || null,
        email = userDetails.email || null,
        DOB = userDetails.DOB || null,
        gender = userDetails.gender || null,
        place = userDetails.place || null;
    
    let insertUser_query =  `INSERT INTO user (first_name, last_name, email, phone, gender, place) 
        VALUES ('${first_name}', '${last_name}', '${email}', '${phone}','${gender}', '${place}')`;
    
    return await connection.query(insertUser_query)   
}

async function addNewAppointment(id, appointment_datetime, doctor_id = 1){
    let insertAppointment_query = `INSERT INTO appointments (user_id, appointment_date, doctor_id) 
            VALUES ('${id}', '${appointment_datetime}', ${doctor_id})`;
            console.log(insertAppointment_query);
        return await connection.query(insertAppointment_query);

}

async function listAppointments(appointments_date){
    let listAppointments_query = `SELECT u.*,a.appointment_date FROM user u JOIN appointments a ON u.id=a.user_id where a.appointment_date LIKE '${appointments_date}%' ORDER BY a.appointment_date`;
    return await connection.query(listAppointments_query);
}

module.exports = {isUserExist : isUserExist,
                  addNewUser : addNewUser,
                  addNewAppointment : addNewAppointment,
                  listAppointments : listAppointments,
                  getUserDetails : getUserDetails,
                  getAllUserDetails : getAllUserDetails
};


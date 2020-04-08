//validate signup for null values
const isEmpty = (string) => {
    if(string.trim() === '') {
        return true;
    }
    else {
        return false;
    }
};

//validate BMI for null values
const isNull = (Int) => {
    if(!Int) {
        return true;
    }
    else {
        return false;
    }
};

//validate email
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) {
        return true;
    }
    else {
        return false;
    }
}

//validate user sign up data
exports.validateSignupData = (newUser) => {
    let errors = {}; //initialize error object

    //validate email
    if(isEmpty(newUser.email)) {
        errors.email = 'must not be empty';
    } else if(!isEmail(newUser.email)){
        errors.email = 'must be a valid email address';
    }

    //validate password to not be null
    if(isEmpty(newUser.password)) {
        errors.password = 'must not be empty';
    }

    //validate passwords to match
    if(newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = 'passwords must match';
    }

    //validates unique handle
    if(isEmpty(newUser.handle)) {
        errors.handle = 'must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

//validate user login data
exports.validateLoginData = (user) => {
    let errors = {}; //initialize error object
    
    //validate email login
    if(isEmpty(user.email)) {
        errors.email = 'must not be empty';
    }

    //validate password login
    if(isEmpty(user.password)) {
        errors.password = 'must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

//validate adding to user profile data
exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim())) {
        userDetails.bio = data.bio;
    }
    if(!isEmpty(data.location.trim())) {
        userDetails.location = data.location;
    }
    return userDetails;
}

//validate BMI data
exports.validateBmi = (newBmi) => {
    let errors = {}; //initialize error object

    //validate height in feet
    if(isNull(newBmi.foot)) {
        errors.foot = 'must not be empty';
    }
    else if (newBmi.foot < 0) {
        errors.foot = 'foot must be a positive number';
    }

    //validate height in inches
    if(isNull(newBmi.inch)) {
        errors.inch = 'must not be empty';
    }
    else if (newBmi.inch > 12 || newBmi.inch < 0) {
        errors.inch = 'inch must be between 0 and 12';
    }

    //validate weight in pounds
    if(isNull(newBmi.pound)) {
        errors.pound = 'must not be empty';
    }
    else if (newBmi.pound < 0) {
        errors.pound = 'pound must be a positive number';
    }
    
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}
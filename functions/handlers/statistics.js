const { admin,db } = require('../util/admin');

const config = require('../util/config');

//create bmi method
exports.bmiCalc = (request,response) => {
    //db fields to create bmi
    const newBMI = {
        userHandle: request.user.handle,
        foot: request.body.foot,
        inch: request.body.inch,
        pound: request.body.pound,
        bmi: 703*request.body.pound/((request.body.foot*12 + request.body.inch)**2),
        createdAt: new Date().toISOString()
    };

    //take json to add to db
    db.collection('bmi')
	.add(newBMI)
	.then(doc => {
		const bmiResponse = newBMI;
		bmiResponse.bmiId = doc.id;
		response.json(bmiResponse);
	})
	.catch(err => {
		response.status(500).json({ error: 'something went wrong'});
		console.error(err);
	});
}

//get all user bmi method
exports.getBmi = (request,response) => {
	//db query to get all posts
    db.collection('bmi')
    .where('userHandle', '==', request.user.handle)
	.get()
	.then(data => {
		let bmi = [];
		//for each post, push fields into array
		data.forEach((doc) => {
			bmi.push({
				bmiId: doc.id,
				bmiValue: doc.data().bmi,
			});
		});
		//returns post array
		return response.json(bmi);
	})
	.catch((err) => {
		console.error(err);
		response.status(500).json({ error: err.code});
	});
}
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
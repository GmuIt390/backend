//npm install -g create-react-app
//create-react-app prod-exercise

const functions = require('firebase-functions');

//bring express node js
//npm install --save express
const app = require('express')();

//bring FBAuth middleware to protect routes
const FBAuth = require('./util/fbAuth');

// const { db } = require('./util/admin');

//bring methods from functions/handlers
const { 
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    likePost,
    unlikePost,
    createComment
 } = require('./handlers/posts');
const {
    signup,
    login,
    addUserDetails,
    uploadImage,
    getAuthenticatedUser
 } = require('./handlers/users');

//post.js routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, createPost);
app.get('/post/:postId', getPost);
app.delete('/post/:postId', FBAuth, deletePost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.post('/post/:postId/comment', FBAuth, createComment);

//users.js routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user', FBAuth, addUserDetails);
app.post('/user/image', FBAuth, uploadImage);
app.get('/user', FBAuth, getAuthenticatedUser);

//add /api extention to api links for convention
exports.api = functions.https.onRequest(app);

// //like notification method
// exports.createNotificationOnLike = functions
//     .region('us-central1')
//     .firestore.document('likes/{id}')
//     .onCreate((snapshot) => {
//         db.doc(`/posts/${snapshot.data().postId}`).get()
//             //create notification
//             .then((doc) => {
//                 //validate if post exist
//                 if(doc.exists){
//                     //fields for notification db table
//                     return db.doc(`/notifications/${snapshot.id}`).set({
//                         createdAt: new Date().toISOString,
//                         recipient: doc.data().userHandle,
//                         sender: snapshot.data().userHandle,
//                         type: 'like',
//                         read: false,
//                         postId: doc.id
//                     })
//                 }
//             })
//             //database trigger, not api endpoint: returns nothing
//             .then(() => {
//                 return;
//             })
//             .catch((err) => {
//                 console.error(err);
//                 return;
//             })
//     });

// //delete notification method
// exports.deleteNotificationOnLike = functions
//     .region('us-central1')
//     .firestore.document('likes/{id}')
//     //delete notification
//     .onDelete((snapshot) => {
//         db.doc(`/notifications/${snapshot.id}`)
//             .delete()
//             //database trigger, not api endpoint: returns nothing
//             .then(() => {
//                 return;
//             })
//             .catch((err) => {
//                 console.error(err);
//                 return;
//             })
//     });

// //comment notification method
// exports.createNotificationOnComment = functions
//     .region('us-central1')
//     .firestore.document('likes/{id}')
//     .onCreate((snapshot) => {
//         db.doc(`/posts/${snapshot.data().postId}`).get()
//             //create notification
//             .then((doc) => {
//                 //validate if post exist
//                 if(doc.exists){
//                     //fields for notification db table
//                     return db.doc(`/notifications/${snapshot.id}`).set({
//                         createdAt: new Date().toISOString,
//                         recipient: doc.data().userHandle,
//                         sender: snapshot.data().userHandle,
//                         type: 'comment',
//                         read: false,
//                         postId: doc.id
//                     })
//                 }
//             })
//             //database trigger, not api endpoint: returns nothing
//             .then(() => {
//                 return;
//             })
//             .catch((err) => {
//                 console.error(err);
//                 return;
//             })
//     });
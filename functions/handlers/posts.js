const { db } = require('../util/admin');

//get all posts method
exports.getAllPosts = (request,response) => {
    db.collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let posts = [];
            //for each post, push fields into array
            data.forEach((doc) => {
                posts.push({
                    postId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            //returns post array
            return response.json(posts);
        })
        .catch((err) => {
            console.error(err);
            response.status(500).json({ error: err.code});
        });
}

//create post method
exports.createPost = (request,response) => {
    //db fields to create post
    const newPost = {
        body: request.body.body,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    //take json to add to db
    db.collection('posts')
        .add(newPost)
        .then(doc => {
            const postResponse = newPost;
            postResponse.postId = doc.id;
            response.json(postResponse);
        })
        .catch(err => {
            response.status(500).json({ error: 'something went wrong'});
            console.error(err);
        });
}

//get single post details method
exports.getPost = (request,response) => {
    let postData = {};

    //get post details from db
    db.doc(`/posts/${request.params.postId}`).get()
    .then((doc) => {
        if(!doc.exists){
            return response.status(404).json({ error: 'post not found'});
        }
        postData = doc.data();
        postData.postId = doc.id;
        return db.collection('comments')
        .orderBy('createdAt', 'desc')
        .where('postId', '==', request.params.postId)
        .get();
    })
    //push comments into array into post details
    .then((data) => {
        postData.comments = [];
        data.forEach((doc) => {
            postData.comments.push(doc.data());
        })
    return response.json(postData);
    })
    .catch(err => {
        console.error(err);
        return response.status(500).json({ error: err.code })
    })
}

//delete post method
exports.deletePost = (request,response) => {
    const document = db.doc(`/posts/${request.params.postId}`);
    
    //get document
    document.get()
        //validate if post exist
        .then((doc) => {
            if(!doc.exists){
                return response.status(404).json({ error: 'post not found'});
            }
            //get authorization to delete
            if(doc.data().userHandle !== request.user.handle){
                return response.status(403).jso({ error: 'unauthorized'});
            }
            else {
                return document.delete();
            }
        })
        .then(() => {
            response.json({ mesage: 'post deleted successfully'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        })
}

//like post method
exports.likePost = (request,response) => {
    //get likes rows from db
    const likeDocument = db.collection('likes')
        .where('userHandle', '==', request.user.handle)
        .where('postId', '==', request.params.postId).limit(1);
    //get post row from db
    const postDocument = db.doc(`/posts/${request.params.postId}`);

    let postData;

    //validate if post exisits
    postDocument.get()
        .then((doc) => {
            if(doc.exists){
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            }
            else {
                return response.status(404).json({ error: "post not found"});
            }
        })
        //add like to db
        .then((data) => {
            //validate if liked already
            if(data.empty){
                return db.collection('likes').add({
                    postId: request.params.postId,
                    userHandle: request.user.handle
                })
                //update post like count
                .then(() => {
                    postData.likeCount++;
                    return postDocument.update({ likeCount: postData.likeCount});
                })
                //return post
                .then(() => {
                    return response.json(postData);
                })
            } else {
                return response.status(400).json({ error: 'post already liked' });
            }
        })
        .catch((err) => {
            console.error(err);
            response.status(500).json({ error: err.code });
        });
}

//unlike post method
exports.unlikePost = (request,response) => {
    //get likes rows from db
    const likeDocument = db.collection('likes')
        .where('userHandle', '==', request.user.handle)
        .where('postId', '==', request.params.postId).limit(1);
    //get post row from db
    const postDocument = db.doc(`/posts/${request.params.postId}`);

    console.log(likeDocument);
    console.log(postDocument);

    let postData;

    //validate if post exisits
    postDocument.get()
        .then((doc) => {
            if(doc.exists){
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            }
            else {
                return response.status(404).json({ error: "post not found"});
            }
        })
        //delete like from db
        .then((data) => {
            //validate if liked already
            if(data.empty){
                return response.status(400).json({ error: 'post not liked' });
            } else {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    //update post like count
                    .then(() => {
                        postData.likeCount--;
                        return postDocument.update({ likeCount: postData.likeCount });
                    })
                    //return post
                    .then(() => {
                        response.json(postData);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            response.status(500).json({ error: err.code });
        });
}

//comment on post method
exports.createComment = (request,response) => {
    //validate comment
    if(request.body.body.trim() === ''){
        return response.status(400).json({ comment: 'must not be empty'});
    }
    //fields for comment inout
    const  newComment = {
        body: request.body.body,
        createdAt: new Date().toISOString(),
        postId: request.params.postId,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl
    };
    //validate if post exists
    db.doc(`/posts/${request.params.postId}`).get()
        .then((doc) => {
            if(!doc.exists){
                return response.status(404).json({ error: 'post not found'});
            }
            //increase comment count for post
            return doc.ref.update({ commentCount: doc.data().commentCount+1});  
        })
        .then(() => {
            //go to db: pass json to add row of data
            return db.collection('comments').add(newComment);
        })
        //return comment
        .then(() => {
            response.json(newComment);
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ error: 'something went wrong' })
        })
}
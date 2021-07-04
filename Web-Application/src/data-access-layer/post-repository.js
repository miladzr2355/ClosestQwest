const db = require('./db')

module.exports = function() {

    /*
    	Retrieves all posts for the given threadId.
    	Possible errors: internalError
    	Success value: The fetched posts in an array.
    */
    exports.getAllPosts = function(threadId, callback) {

        const query = ` SELECT p.postId, p.postTitle, p.postContent, p.postOnThread, p.postOfAccount, t.threadName 
                        FROM post as p 
                        LEFT JOIN thread as t 
                        ON p.postOnThread = t.threadId 
                        WHERE postOnThread = ?
                        ORDER by postId DESC`

        db.query(query, threadId, function(error, posts) {
            if (error) {
                callback(['internalError'], null)
            } else {
                callback([], posts)
            }
        })
    }

    /*
    	Creates a new post.
    	post: {title: "The title", content: "The content"}
    	Possible errors: internalError, title Taken
    */
    exports.createPost = function(post, callback) {
        
        const query = `INSERT INTO post (postTitle, postContent, postOnThread, postOfAccount) VALUES (?, ?, ?, ?)`
        const values = [post.title, post.content, post.postOnThread, post.postOfAccount]

        db.query(query, values, function(error) {
            if (error) {
                if (error.sqlMessage.includes("titleUnique")) {
                    callback(['title Taken'])
                } else {
                    callback(['internalError'])
                }
            } else {
                callback([])
            }
        })

    }

    return exports

}
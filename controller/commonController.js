class controllerCommon {
    success(res) {
        return (result) => {
            res.status(200); // Found
            res.json(result);
        }
    }

    editSuccess(res) {
        return (result) => {
            res.status(201); // Created/Updated/Deleted
            res.json({id: result});
        }
    }

    serverError(res) {
        return (error) => {
            res.status(500);
            res.json(error);
        }
    }

    notFound(res) {
        return (error) => {
            res.status(404); 
            res.json(error);
        }
    }

    unhautorized(res){
        return (error) => {
            res.status(401);
            res.json(error);
        }
    }
}

module.exports = controllerCommon;
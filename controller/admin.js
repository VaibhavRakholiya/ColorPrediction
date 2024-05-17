class AdminController{
    async loadPage(req,res){
        res.render('pages/auth/login' );
    }
    async loadDashboard(req,res){
        res.render('pages/dashboard/dashboard' );
    }
    async loadChildRegistration(req,res){
        res.render('pages/dashboard/childRegistration' );
    }
    async changePassword(req,res){
        res.render('pages/dashboard/changePassword' );
    }
    async changePin(req,res){
        res.render('pages/dashboard/changePin' );
    }
    async updateProfile(req,res){
        res.render('pages/dashboard/updateProfile' );
    }
    async drewDetails(req,res){
        res.render('pages/dashboard/drewDetails' );
    }
    async contactUs(req,res){
        res.render('pages/dashboard/contactus');
    }
    async pinPassword(req,res){
        res.render('pages/dashboard/pinPassword');
    }
}

module.exports={
    adminController : new AdminController()
}

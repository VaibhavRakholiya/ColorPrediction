const bcrypt = require("bcrypt");
const { userModel } = require("../model/user/user");
const jwt = require("jsonwebtoken");
const user = require("../model/user");
const { updatePinPassModel } = require("../model/pinPasswordUpdate/updatePinPasswprd");

class UserController {
  async createUser(req, res) {
    // const token = req.cookies.token;
    // const decodedToken = jwt?.verify(token, process.env.TOKEN);
    // if (!decodedToken) {
    //   return res.errorHandler({
    //     res,
    //     message: "you are not authorized",
    //   });
    // }
    // const userData = await user.findOne({ username: decodedToken.username });
    try {
      const createUserData = {
        ...req.body,
        password: await bcrypt.hash(req.body.password, 12),
        // created_by: userData.username
      };
      console.log("createUserData: ", createUserData);
      const data = await userModel.createUser(createUserData);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      await res.handler({
        res,
        data,
        message: "user has been created successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
  async loginUser(req, res) {
    try {
      console.log("=======================");
      const data = await userModel.login(req.body);
      console.log('data: ', data);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
        // req.flash("danger" , "invalid Id or password");
        // return res.status(400).redirect("/admin");
        // return false;
      }
      res.status(200).cookie("token", data.token)
        res.handler({ res, message: "login successfully", data })
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async loginAppUser(req, res) {
    try {
      const data = await userModel.userLogin(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "Success",
        data,
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async updateUserCoins(req, res) {
    try {
      const data = await userModel.UpdateCoins(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "Success",
        data,
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async logoutUser(req, res) {
    try {
      // return res.status(200)
      res.clearCookie("token");
      res.handler({
        res,
        data: { data: true },
        message: "logout successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
  async checkAuth(req, res) {
    try {
      const token = req.cookies.token;
      if (token) {
        const data = await userModel.checkAuth(token);
        return res.handler({
          res,
          data: {
            token: token,
            point_balance: data?.point_balance,
            username: data?.username,
            name:data?.first_name + ' ' + data?.last_name,
            point_balance:data?.point_balance

          },
          message: "success",
        });
      }
      return res.handler({
        res,
        data: { token: token },
        message: "success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
  async createTransection(req, res) {
    try {
      console.log("==>", typeof req.body);
      const data = await userModel.createTransection(req.body);

      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data: data,
        message: "Point transfer successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
  async getTransferableTarnsection(req, res) {
    try {
      const data = await userModel.getTransferableTarnsection(
        req.body.username
      );
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data: data,
        message: "history successfully fatched",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
  async getReceivablesTarnsection(req, res) {
    try {
      const data = await userModel.getReceivablesTarnsection(req.body.username);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data: data,
        message: "history successfully fatched",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async receiveAllPoints(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.receiveAllPoints(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "receive point success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async receiveAllPointsMobile(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.receiveAllPointsMobile(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "receive point success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async rejectPoints(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.rejectPoints(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "reject point success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async rejectPointsMobile(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.rejectPointsMobile(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "reject point success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async cancelPoints(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.cancelPoints(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "reject point success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async cancelPointsMobile(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.cancelPointsMobile(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "reject point success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async updatePin(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.updatePin(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "pin updated successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
  async updatePassword(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.updatePassword(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "password updated successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
  async getUser(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.getUser(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          data,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data,
        message: "user fetch successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async updateUser(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.updateUser(req.body);
      if (data?.error) {
        return res.errorHandler({
          res,
          data,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data,
        message: "user update successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async getMyUser(req, res) {
    try {
      console.log("===>", req.body);
      const data = await userModel.getMyUser(req.body);
      console.log('data: ', data);
      if (data?.error) {
        return res.errorHandler({
          res,
          data,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data,
        message: "get my users successfully",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async updatePinPass(req, res) {
    try {
      console.log("===>", req.body);
      const data = await updatePinPassModel.create(req.body)
// .      console.log('data: ', data);
      if (data?.error) {
        return res.errorHandler({
          res,
          data,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data,
        message: "success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async listPinPass(req, res) {
    try {
      // console.log("===>", req.body);
      const data = await updatePinPassModel.list(req.body)
      // console.log('data: ', data);
// .      console.log('data: ', data);
      if (data?.error) {
        return res.errorHandler({
          res,
          data,
          message: data.message,
        });
      }
      return res.handler({
        res,
        data,
        message: "success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async changePinPass(req, res) {
    try {
      console.log("===>", req.body);
      const data = await updatePinPassModel.changePinPass(req.body)
      if (data?.error) {
        return res.errorHandler({
          res,
          data,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }

  async resetPinPass(req, res) {
    try {
      console.log("===>", req.body);
      const data = await updatePinPassModel.resetPinPass(req.body)
      if (data?.error) {
        return res.errorHandler({
          res,
          data,
          message: data.message,
        });
      }
      return res.handler({
        res,
        message: "success",
      });
    } catch (error) {
      console.log("error: ", error);
      res.errorHandler({ res });
    }
  }
}
module.exports = {
  usercontroller: new UserController(),
};

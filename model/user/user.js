const User = require("./index");
const Transection = require("../transections/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
class UserModel {
  async createUser(data) {
    const { username, password } = data;
    const user = await User.findOne({ username: username });
    if (user) {
      return {
        error: true,
        message: "Your username is already exist in our system",
      };
    }
    return await User.create(data);
  }

  async login(data) {
    const { username, password } = data;
    const user = await User.findOne({ username: username });
    if (!user) {
      return {
        error: true,
        message: "Your username is not exist in our system",
      };
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return {
        error: true,
        message: "password does not match",
      };
    }
    const expirationTime = Math.floor(Date.now() / 1000) + 900;
    const token = jwt.sign(
      { username: user.username, exp: expirationTime },
      process.env.TOKEN
    );
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      point_balance: user.point_balance,
      token: token,
    };
  }

  async userLogin(data) {
    const { username, password } = data;
    const user = await User.findOne({ username: username });
    if (!user) {
      return {
        error: true,
        message: "Your username is not exist in our system",
      };
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return {
        error: true,
        message: "password does not match",
      };
    }
    const token = jwt.sign({ username: user.username }, process.env.TOKEN);
    User.updateOne({ username: username },{$set:{is_logged_in : 1}});
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      point_balance: user.point_balance,
    };
  }

  async UpdateCoins(data) {
    const { username, newBalance, token } = data;
    const user = await User.findOne({ username: username });
    if (!user) {
      return {
        error: true,
        message: "Your username is not exist in our system",
      };
    }

    const updateDoc = {
      $set: {
        point_balance: newBalance,
      },
    };
    await User.updateOne({ username: username }, updateDoc);

    return {
      message: "Coins Updated Successfully",
      newBalance
    };
  }

  async checkAuth(token) {
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userData = await User.findOne({ username: decodedToken.username });
    return userData;
  }
  async createTransection(data) {
    const { to_member_id, pin, amount, from_member_id } = data;
    const toUser = await User.findOne({ username: to_member_id });
    console.log("toUser: ", toUser);
    const FromUser = await User.findOne({ username: from_member_id });
    if (to_member_id === from_member_id) {
      return {
        error: true,
        message: "You Cann't Transfer Points to yourself",
      };
    }
    if (!toUser) {
      return {
        error: true,
        message: "Invalid To Account No!",
      };
    }
    if (FromUser?.pin != pin) {
      return {
        error: true,
        message: "Invalid Pin!",
      };
    }
    if (FromUser?.point_balance < amount) {
      return {
        error: true,
        message: "*Balance is not Enough",
      };
    }

    //deduct point balance
    const updatePointBalance = await User.updateOne(
      { username: from_member_id },
      { $set: { point_balance: FromUser.point_balance - amount } }
    );

    // //add point balance
    // const addPointBalance = await User.updateOne(
    //   { username: to_member_id },
    //   { $set: { point_balance: toUser.point_balance + amount } }
    // );
    //create history
    data.type = toUser.member_type;
    console.log("data======================>: ", data);
    const createHistoty = await Transection.create(data);
    return createHistoty;
  }

  async getTransferableTarnsection(username) {
    return await Transection.find({ from_member_id: username, status: 1 });
  }
  async getReceivablesTarnsection(username) {
    return await Transection.find({ to_member_id: username, status: 1 });
  }

  async getOnlinePlayers() {
    return await User.find({status: 1 });
  }

  async receiveAllPoints(data) {
    let { checkedIds, username } = data;
    const ids = checkedIds.map((elem) => {
      return new ObjectId(elem);
    });
    console.log("ids: ", ids);
    const points = await Transection.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $group: {
          _id: null, // Group by null to calculate the sum across all documents
          totalAmount: { $sum: "$amount" }, // Calculate the sum of the amount field
        },
      },
      {
        $project: { _id: 0, totalAmount: 1 },
      },
    ]);

    //receive point
    const user = await User.findOne({ username });
    const addPoint = await User.updateOne(
      { username }, // Specify the document to update based on its _id
      { $set: { point_balance: user?.point_balance + points[0]?.totalAmount } } // Use $inc to increment the amount field by 5
    );
    const updateHistory = await Transection.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 2 } }
    );
    return updateHistory;
  }

  async receiveAllPointsMobile(data) {
    let { checkedIds, username } = data;
    checkedIds = checkedIds.split(',');
    const ids = checkedIds.map((elem) => {
      return new ObjectId(elem);
    });
    console.log("ids: ", ids);
    const points = await Transection.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $group: {
          _id: null, // Group by null to calculate the sum across all documents
          totalAmount: { $sum: "$amount" }, // Calculate the sum of the amount field
        },
      },
      {
        $project: { _id: 0, totalAmount: 1 },
      },
    ]);

    //receive point
    const user = await User.findOne({ username });
    const addPoint = await User.updateOne(
      { username }, // Specify the document to update based on its _id
      { $set: { point_balance: user?.point_balance + points[0]?.totalAmount } } // Use $inc to increment the amount field by 5
    );
    const updateHistory = await Transection.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 2 } }
    );
    return updateHistory;
  }

  async rejectPoints(data) {
    const { checkedIds, username } = data;
    const ids = checkedIds.map((elem) => {
      return new ObjectId(elem);
    });
    console.log("ids: ", ids);
    const points = await Transection.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $group: {
          _id: null, // Group by null to calculate the sum across all documents
          totalAmount: { $sum: "$amount" }, // Calculate the sum of the amount field
        },
      },
      {
        $project: { _id: 0, totalAmount: 1 },
      },
    ]);

    //receive point
    const from_member = await Transection.findOne({ _id: ids[0] });
    const user = await User.findOne({ username: from_member?.from_member_id });
    const addPoint = await User.updateOne(
      { username: from_member?.from_member_id },
      { $set: { point_balance: user?.point_balance + points[0]?.totalAmount } }
    );
    const updateHistory = await Transection.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 2 } }
    );
    return updateHistory;
  }

  async rejectPointsMobile(data) {
    let { checkedIds, username } = data;
    checkedIds = checkedIds.split(',');
    const ids = checkedIds.map((elem) => {
      return new ObjectId(elem);
    });
    console.log("ids: ", ids);
    const points = await Transection.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $group: {
          _id: null, // Group by null to calculate the sum across all documents
          totalAmount: { $sum: "$amount" }, // Calculate the sum of the amount field
        },
      },
      {
        $project: { _id: 0, totalAmount: 1 },
      },
    ]);

    //receive point
    const from_member = await Transection.findOne({ _id: ids[0] });
    const user = await User.findOne({ username: from_member?.from_member_id });
    const addPoint = await User.updateOne(
      { username: from_member?.from_member_id },
      { $set: { point_balance: user?.point_balance + points[0]?.totalAmount } }
    );
    const updateHistory = await Transection.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 2 } }
    );
    return updateHistory;
  }

  async cancelPoints(data) {
    const { checkedIds, username } = data;
    const ids = checkedIds.map((elem) => {
      return new ObjectId(elem);
    });
    console.log("ids: ", ids);
    const points = await Transection.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $group: {
          _id: null, // Group by null to calculate the sum across all documents
          totalAmount: { $sum: "$amount" }, // Calculate the sum of the amount field
        },
      },
      {
        $project: { _id: 0, totalAmount: 1 },
      },
    ]);

    //cancel point
    const user = await User.findOne({ username });
    const addPoint = await User.updateOne(
      { username }, // Specify the document to update based on its _id
      { $set: { point_balance: user?.point_balance + points[0]?.totalAmount } } // Use $inc to increment the amount field by 5
    );
    const updateHistory = await Transection.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 3 } }
    );
    return updateHistory;
  }

  async cancelPointsMobile(data) {
    let { checkedIds, username } = data;
    checkedIds = checkedIds.split(',');
    const ids = checkedIds.map((elem) => {
      return new ObjectId(elem);
    });
    console.log("ids: ", ids);
    const points = await Transection.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $group: {
          _id: null, // Group by null to calculate the sum across all documents
          totalAmount: { $sum: "$amount" }, // Calculate the sum of the amount field
        },
      },
      {
        $project: { _id: 0, totalAmount: 1 },
      },
    ]);

    //cancel point
    const user = await User.findOne({ username });
    const addPoint = await User.updateOne(
      { username }, // Specify the document to update based on its _id
      { $set: { point_balance: user?.point_balance + points[0]?.totalAmount } } // Use $inc to increment the amount field by 5
    );
    const updateHistory = await Transection.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 3 } }
    );
    return updateHistory;
  }

  async updatePin(data) {
    const { old_pin, pin, password, username } = data;
    const user = await User.findOne({ username: username });
    console.log("user?.pin: ", user?.pin, old_pin);
    if (user?.pin != old_pin) {
      return {
        error: true,
        message: "old pin is incurrect",
      };
    }
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return {
        error: true,
        message: "password does not match",
      };
    }
    const update_pin = await User.updateOne(
      { username: username },
      { $set: { pin: pin } }
    );
    return update_pin;
  }
  async updatePassword(data) {
    const { old_password, pin, password, username } = data;
    const user = await User.findOne({ username: username });
    const result = await bcrypt.compare(old_password, user.password);
    if (!result) {
      return {
        error: true,
        message: "old password does not match",
      };
    }

    if (user?.pin != pin) {
      return {
        error: true,
        message: "pin is incurrect",
      };
    }

    const pass = await bcrypt.hash(password, 12);
    const update_pass = await User.updateOne(
      { username: username },
      { $set: { password: pass } }
    );
    return update_pass;
  }

  async getUser(data) {
    const { username } = data;
    const user = await User.findOne({ username: username });
    return user;
  }
  async updateUser(data) {
    // const { username } = data;
    const user = await User.updateOne(
      { username: data.username },
      { $set: data }
    );
    return user;
  }
  async getMyUser(data) {
    // const { username } = data;
    const user = await User.find({ created_by: data.username }).select(
      "username"
    );
    return user;
  }
}
module.exports = {
  userModel: new UserModel(),
};

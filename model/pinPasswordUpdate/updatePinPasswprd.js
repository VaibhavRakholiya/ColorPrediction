const {
  generateRandomPassword,
  generateRandomNumber,
} = require("../../utils/util");
const updatePinPass = require("./index");
const User = require("../user/index");
const bcrypt = require("bcrypt");

class UpdatePinPassModel {
  async create(data) {
    const { member_id } = data;
    const isExist = await updatePinPass.findOne({ member_id });
    if (isExist) {
      return await updatePinPass.updateOne({ member_id }, { $set: data });
    } else {
      return await updatePinPass.create({ ...data, created_at: data.username });
    }
  }

  async list(data) {
    const { username } = data;
    return await updatePinPass.find({ created_at: username });
  }

  async changePinPass(data) {
    const { username } = data;
    console.log("username: ", username);
    const dataList = await updatePinPass.find({ created_at: username });
    if (dataList?.length) {
      const updateOperations = [];
      const updateUser = [];
      const result = await Promise.all(
        dataList.map(async (elem) => {
          if (elem?.required === "Need Password") {
            const password = generateRandomPassword();
            updateOperations.push({
              updateOne: {
                filter: { member_id: elem?.member_id },
                update: { $set: { reset_status: password } },
              },
            });
            updateUser.push({
              updateOne: {
                filter: { username: elem?.member_id },
                update: { $set: { password: await bcrypt.hash(password, 12) } },
              },
            });
            // await updatePinPass.updateOne(
            //   { member_id: elem?.member_id },
            //   { $set: { reset_status: password } }
            // );
            // await User.updateOne(
            //   { username: elem?.member_id },
            //   { $set: { password: await bcrypt.hash(password, 12) } }
            // );
          } else if (elem?.required === "Need Pin") {
            const pin = generateRandomNumber();
            updateOperations.push({
              updateOne: {
                filter: { member_id: elem?.member_id },
                update: { $set: { reset_status: pin } },
              },
            });
            updateUser.push({
              updateOne: {
                filter: { username: elem?.member_id },
                update: { $set: { pin: parseInt(pin) } },
              },
            });
            // await updatePinPass.updateOne(
            //   { member_id: elem?.member_id },
            //   { $set: { reset_status: pin } }
            // );
            // await User.updateOne(
            //   { username: elem?.member_id },
            //   { $set: { pin: parseInt(pin) } }
            // );
          } else if (elem?.required === "Need Both") {
            const password = generateRandomPassword();
            const pass = await bcrypt.hash(password, 12);
            const pin = generateRandomNumber();
            updateOperations.push({
              updateOne: {
                filter: { member_id: elem?.member_id },
                update: { $set: { reset_status: `${pin}-${password}` } },
              },
            });
            updateUser.push({
              updateOne: {
                filter: { username: elem?.member_id },
                update: { $set: { pin: parseInt(pin), password: pass } },
              },
            });
            // await updatePinPass.updateOne(
            //   { member_id: elem?.member_id },
            //   { $set: { reset_status: `${pin}-${password}` } }
            // );
            // await User.updateOne(
            //   { username: elem?.member_id },
            //   { $set: { pin: parseInt(pin), password: pass } }
            // );
          }
        })
      );
      console.log("updateOperations", JSON.stringify(updateOperations));
      console.log("updateUser", JSON.stringify(updateUser));
      await updatePinPass.bulkWrite(updateOperations)
      return await User.bulkWrite(updateUser)
      // console.log("result", result);
    }
    return true;
  }

  async resetPinPass(data) {
    const { username } = data;
    return await updatePinPass.deleteMany(
      { created_at: username },
    );
  }
}

module.exports = {
  updatePinPassModel: new UpdatePinPassModel(),
};

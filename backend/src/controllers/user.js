const User = require("../models/user");

const { uploader, validId } = require("../utils/index");

// @route GET /
// @desc Show welcome message
// @access Private
exports.index = async (req, res) => {
  const loggedInUser = req.user;

  if (loggedInUser._id.toString() === undefined)
    return res
      .status(401)
      .json({ message: "Must be logged in to see list of users." });

  if (loggedInUser.role !== "admin")
    return res
      .status(401)
      .json({ message: "You do not have permission to see list of users." });

  const users = await User.find({});
  res.status(200).json({ users });
};

// @route GET api/user/{id}
// @desc Return existing user
// @access Public
exports.show = async function (req, res) {
  try {
    const id = req.params.id;

    if (validId(id)) {
      const user = await User.findById(id);

      if (!user) {
        return res
          .status(401)
          .json({ message: "User with ID " + id + " does not exist." });
      }

      return res.status(200).json({ user: user });
    }

    return res
      .status(401)
      .json({ message: "The user ID " + id + " is invalid." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH api/user/{id}
// @desc Update existing user
// @access Public
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const dataToUpdate = req.body;
    const loggedInUserId = req.user._id;

    // Check if update is by logged in user
    if (id.toString() !== loggedInUserId.toString())
      return res.status(401).json({
        message: "You do not have the permission to update this profile.",
      });

    if (validId(id)) {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: dataToUpdate },
        { new: true }
      );

      // If there is no image, return success
      if (!req.file)
        return res
          .status(200)
          .json({ message: "User updated successfully", user: user });

      // If there's image, attempt to upload to Cloudinary
      const result = await uploader(req);
      const _user = await User.findByIdAndUpdate(
        id,
        { $set: { profileImage: result.url } },
        { new: true }
      );

      // If there is no image, return success
      if (!req.file)
        return res
          .status(200)
          .json({ message: "User updated successfully", user: _user });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // @route PATCH api/user/upload
// // @desc Upload profile image
// // @access Public
// exports.upload = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const loggedInUser = req.user;
//     const file = req.file;

//     if (id.toString() !== loggedInUser._id.toString())
//       return res.status(401).json({
//         message: "You do not have the permission to update this profile.",
//       });

//     // Upload profile image to Cloudinary
//     const result = await uploader(file);

//     await User.findByIdAndUpdate(
//       id,
//       { $set: { profileImage: result.url } },
//       { new: true }
//     );

//     res.status(200).json({ message: "Profile image uploaded successfully." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// @route api/user/{id}
// @desc Delete existing user
// @access Private
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;

    if (user._id.toString() === undefined)
      return res
        .status(401)
        .json({ message: "Must be logged in to delete users." });

    if (user.role !== "admin")
      return res
        .status(401)
        .json({ message: "You do not have permission to delete users." });

    await User.deleteOne(id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

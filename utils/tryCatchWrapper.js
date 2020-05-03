exports.tryCatchWrapper = async (cb) => {
  try {
    await cb();
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).json("Server Error.");
  }
};

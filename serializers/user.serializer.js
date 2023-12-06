// Serialize user data for response
const serializeUser = (req, res, next) => {
  let { rows } = res.data;
  let response = [];

  // Handling case where rows is not present in response data
  rows = rows ? rows : [res.data];

  // Constructing the serialized response for each user
  for (const user of rows) {
    response.push({
      id: user.id,
      email: user.email,
      isActive: user.is_active,
      isEmailVerified: user.is_email_verified,
      role: user.role,
    });
  }

  // Updating res.data with the serialized response
  if (!res.data.rows) {
    res.data = response[0];
  } else {
    res.data.rows = response;
  }

  next();
};

// Serialize user payment detail data for response
const serializeUserPaymentDetail = (req, res, next) => {
  let { rows } = res.data;
  let response = [];

  // Handling case where rows is not present in response data
  if (!rows) {
    rows = [res.data];
  }

  // Constructing the serialized response for each payment detail
  for (const paymentDetail of rows) {
    response.push({
      id: paymentDetail.id,
      ifsc: paymentDetail.ifsc,
      accountNumber: paymentDetail.account_number,
      bankName: paymentDetail.bank_name,
      userId: paymentDetail.user_id,
    });
  }

  // Updating res.data with the serialized response
  if (!res.data.rows) {
    res.data = response[0];
  } else {
    res.data.rows = response;
  }

  next();
};

// Serialize user preference data for response
const serializeUserPreferences = (req, res, next) => {
  let { rows } = res.data;
  let response = [];

  // Handling case where rows is not present in response data
  if (!rows) {
    rows = [res.data];
  }

  // Constructing the serialized response for each user preference
  for (const userPreference of rows) {
    response.push({
      id: userPreference.id,
      genre: userPreference.genre,
      userId: userPreference.user_id,
    });
  }

  // Updating res.data with the serialized response
  if (!res.data.rows) {
    res.data = response[0];
  } else {
    res.data.rows = response;
  }

  next();
};

// Serialize user profile data for response
const serializeUserProfile = (req, res, next) => {
  let { rows } = res.data;
  let response = [];

  // Handling case where rows is not present in response data
  if (!rows) {
    rows = [res.data];
  }

  // Constructing the serialized response for each user profile
  for (const profile of rows) {
    response.push({
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      phoneNumber: profile.phone_number,
      imageUrl: profile.image_url,
      thumbnailUrl: profile.thumbnail_url,
      userId: profile.user_id,
    });
  }

  // Updating res.data with the serialized response
  if (!res.data.rows) {
    res.data = response[0];
  } else {
    res.data.rows = response;
  }

  next();
};

module.exports = {
  serializeUser,
  serializeUserPaymentDetail,
  serializeUserProfile,
  serializeUserPreferences,
};

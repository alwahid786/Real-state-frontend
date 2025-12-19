const AVATAR_COLORS = [
  "bg-red-500 text-white",
  "bg-blue-200 text-blue-600",
  "bg-green-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-indigo-500 text-white",
  "bg-yellow-500 text-black",
  "bg-teal-500 text-white",
];

export const getUserInitial = (user) => {
  if (user?.name && user.name.trim()) {
    return user.name.trim().charAt(0).toUpperCase();
  }

  if (user?.email && user.email.trim()) {
    return user.email.trim().charAt(0).toUpperCase();
  }

  return "U";
};

export const getAvatarColor = (letter) => {
  if (!letter) return AVATAR_COLORS[0];

  const charCode = letter.charCodeAt(0);
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
};

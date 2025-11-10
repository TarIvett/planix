export const PROFILE_PICTURES = [
    { id: 1, name: "Black face", src: "/images/pfp-black.jpeg" },
    { id: 2, name: "Grey face", src: "/images/pfp_grey.jpeg" },
    { id: 3, name: "Yellow duck", src: "/images/pfp-yellow-duck.jpg" },
    { id: 4, name: "White duck", src: "/images/pfp_white_duck.jpeg" },
    { id: 5, name: "Shark", src: "/images/pfp-shark.jpeg" },
    { id: 6, name: "Blue bear", src: "/images/pfp_blue_bear.jpeg" },
    { id: 7, name: "Pink bear", src: "/images/pfp_pink_bear.jpeg" },
];

export const getProfilePicture = (id) => {
    const picture = PROFILE_PICTURES.find(p => p.id === id);
    return picture ? picture.src : PROFILE_PICTURES[0].src;
};
function create(img) {
    return {
        id: img.id,
        width: img.width,
        height: img.height,
        color: img.color,
        description: img.description,
        alt_description: img.alt_description,
        urls: img.urls,
    };
}

module.exports = {
    create,
}
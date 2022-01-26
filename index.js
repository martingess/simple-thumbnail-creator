const fse = require("fs-extra");
const Jimp = require("jimp");

const config = {
  inputFolder: "uploads",
  outputFolder: "uploads_thumbnail",
  thumbnailPrefix: "thumbnail_50x50",
  allowedFormats: [".jpg", ".jpeg", ".png"],
  thumbnailSize: {
    w: 50,
    h: 50,
  },
};

async function init() {
  // create files list with allowed formats format from input folder.
  const filesNames = (
    await fse.readdir(`${__dirname}/${config.inputFolder}/`)
  ).filter((fileName) => {
    const fileExt = fileName.slice(fileName.lastIndexOf("."), fileName.length);
    return config.allowedFormats.includes(fileExt);
  });
  // create 50x50 thumbnail for each file.
  filesNames.forEach(async (fileName) => {
    try {
      const imgThumbnail = await Jimp.read(
        __dirname + `/${config.inputFolder}/` + fileName
      );
      imgThumbnail.resize(config.thumbnailSize.w, config.thumbnailSize.h);
      imgThumbnail.write(
        __dirname +
          `/${config.outputFolder}/` +
          config.thumbnailPrefix +
          fileName
      );
    } catch (err) {
      console.error(err);
      console.error(`[ERROR_MSG] Error while processing ${fileName}, skip.`);

      return;
    }
  });

  return;
}

init();

/**
 * db_update
 * 
 *db.getCollection("users").aggregate(
    [
        { 
            "$match" : { 
                "avatar.fileName" : { 
                    "$ne" : null
                }
            }
        }, 
        { 
            "$set" : { 
                "avatar.thumbnailFileName" : { 
                    "$concat" : [
                        "thumbnail_50x50", 
                        "$avatar.fileName"
                    ]
                }
            }
        }, 
        { 
            "$merge" : { 
                "into" : "users"
            }
        }
    ], 
    { 
        "allowDiskUse" : false
    }
);

 */

let canvasSize = 500;
let currentFunction = Recreate;

function handleClick() {
    readURL($("#fileOne")[0], $("#imageOne"));
    readURL($("#fileTwo")[0], $("#imageTwo"));
    setTimeout(currentFunction, 100);
}

function changeFunction() {
    let span = $("#currentFunctionSpan");

    if (currentFunction === Recreate) {
        currentFunction = orderByIntensity;
        span.text(" Order By Intensity");
        $("#fileTwo").css("display", "none");
        $("#canvasThree").css("display", "none");
    } else {
        currentFunction = Recreate;
        span.text(" Recreate Image");
        $("#fileTwo").css("display", "initial");
        $("#canvasThree").css("display", "initial");
    }

    handleClick();
}

function readURL(file, imgDiv) {
    if (file.files && file.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imgDiv.attr("src", e.target.result);
        };
        reader.readAsDataURL(file.files[0]);
    }
}

function Recreate() {
    let canvasOne = $("#canvasOne")[0];
    let canvasTwo = $("#canvasTwo")[0];
    let canvasThree = $("#canvasThree")[0];

    let ctxOne = canvasOne.getContext("2d");
    let ctxTwo = canvasTwo.getContext("2d");
    let ctxThree = canvasThree.getContext("2d");

    let imageOne = $("#imageOne")[0];
    let imageTwo = $("#imageTwo")[0];

    let blankCtx = $("#blank")[0].getContext("2d");
    let blankImageData = blankCtx.getImageData(0, 0, canvasSize, canvasSize);
    ctxOne.putImageData(blankImageData, 0, 0);
    ctxTwo.putImageData(blankImageData, 0, 0);
    ctxThree.putImageData(blankImageData, 0, 0);

    ctxOne.drawImage(
        imageOne,
        Math.floor(imageOne.width / 2) - canvasSize / 2,
        Math.floor(imageOne.height / 2) - canvasSize / 2,
        canvasSize,
        canvasSize,
        0,
        0,
        canvasSize,
        canvasSize
    );
    ctxTwo.drawImage(
        imageTwo,
        Math.floor(imageTwo.width / 2) - canvasSize / 2,
        Math.floor(imageTwo.height / 2) - canvasSize / 2,
        canvasSize,
        canvasSize,
        0,
        0,
        canvasSize,
        canvasSize
    );

    let imgDataOne = ctxOne.getImageData(0, 0, canvasSize, canvasSize);
    let imgDataTwo = ctxTwo.getImageData(0, 0, canvasSize, canvasSize);
    let imgDataThree = ctxThree.getImageData(0, 0, canvasSize, canvasSize);

    let imgDataOneArr = [];
    let imgDataTwoArr = [];

    for (let i = 0; i < imgDataOne.data.length; i += 4) {
        imgDataOneArr.push({
            key: i / 4,
            r: imgDataOne.data[i],
            g: imgDataOne.data[i + 1],
            b: imgDataOne.data[i + 2],
            intensity:
                imgDataOne.data[i] +
                imgDataOne.data[i + 1] +
                imgDataOne.data[i + 2],
        });
    }
    for (let i = 0; i < imgDataTwo.data.length; i += 4) {
        imgDataTwoArr.push({
            key: i / 4,
            r: imgDataTwo.data[i],
            g: imgDataTwo.data[i + 1],
            b: imgDataTwo.data[i + 2],
            intensity:
                imgDataTwo.data[i] +
                imgDataTwo.data[i + 1] +
                imgDataTwo.data[i + 2],
        });
    }

    imgDataOneArr.sort((a, b) => a.intensity - b.intensity);
    imgDataTwoArr.sort((a, b) => a.intensity - b.intensity);

    for (let i = 0; i < imgDataOne.data.length; i += 4) {
        imgDataOneArr[i / 4].key = imgDataTwoArr[i / 4].key;
    }

    imgDataOneArr.sort((a, b) => a.key - b.key);

    for (let i = 0; i < imgDataOne.data.length; i += 4) {
        imgDataThree.data[i] = imgDataOneArr[i / 4].r;
        imgDataThree.data[i + 1] = imgDataOneArr[i / 4].g;
        imgDataThree.data[i + 2] = imgDataOneArr[i / 4].b;
        imgDataThree.data[i + 3] = 255;
    }

    ctxThree.putImageData(imgDataThree, 0, 0);
}

function orderByIntensity() {
    let canvasOne = $("#canvasOne")[0];
    let canvasTwo = $("#canvasTwo")[0];

    let ctxOne = canvasOne.getContext("2d");
    let ctxTwo = canvasTwo.getContext("2d");

    let imageOne = $("#imageOne")[0];

    let blankCtx = $("#blank")[0].getContext("2d");
    let blankImageData = blankCtx.getImageData(0, 0, canvasSize, canvasSize);
    ctxOne.putImageData(blankImageData, 0, 0);

    ctxOne.drawImage(
        imageOne,
        Math.floor(imageOne.width / 2) - canvasSize / 2,
        Math.floor(imageOne.height / 2) - canvasSize / 2,
        canvasSize,
        canvasSize,
        0,
        0,
        canvasSize,
        canvasSize
    );

    let imgDataOne = ctxOne.getImageData(0, 0, canvasSize, canvasSize);
    let imgDataTwo = ctxTwo.getImageData(0, 0, canvasSize, canvasSize);

    let imgDataArr = [];

    for (let i = 0; i < imgDataOne.data.length; i += 4) {
        imgDataArr.push({
            key: i / 4,
            r: imgDataOne.data[i],
            g: imgDataOne.data[i + 1],
            b: imgDataOne.data[i + 2],
            intensity:
                imgDataOne.data[i] +
                imgDataOne.data[i + 1] +
                imgDataOne.data[i + 2],
        });
    }

    imgDataArr.sort((a, b) => a.intensity - b.intensity);

    for (let i = 0; i < imgDataOne.data.length; i += 4) {
        imgDataTwo.data[i] = imgDataArr[i / 4].r;
        imgDataTwo.data[i + 1] = imgDataArr[i / 4].g;
        imgDataTwo.data[i + 2] = imgDataArr[i / 4].b;
        imgDataTwo.data[i + 3] = 255;
    }

    ctxTwo.putImageData(imgDataTwo, 0, 0);
}

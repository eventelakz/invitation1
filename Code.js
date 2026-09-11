function doPost(e) {

  try {

    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName("Guests");


    const data = e.parameter;


    sheet.appendRow([

      new Date(),

      data.name || "",

      data.attendance || "",

      data.guests || "",

      data.message || ""

    ]);


    return ContentService

      .createTextOutput(
        JSON.stringify({
          success: true
        })
      )

      .setMimeType(
        ContentService.MimeType.JSON
      );


  } catch (error) {

    return ContentService

      .createTextOutput(
        JSON.stringify({
          success: false,
          error: error.toString()
        })
      )

      .setMimeType(
        ContentService.MimeType.JSON
      );

  }

}

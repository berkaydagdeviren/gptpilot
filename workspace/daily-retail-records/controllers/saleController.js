const SaleRecord = require('../models/SaleRecord');
const multer = require('multer');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

exports.uploadCsv = async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Assuming CSV format matches SaleRecord model
        await SaleRecord.insertMany(results);
        fs.unlinkSync(req.file.path); // remove the temp file
        console.log('CSV file processed and data imported successfully');
        res.status(201).json({ message: 'Data imported successfully', data: results });
      });
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    res.status(500).json({ message: 'Failed to import data', error: error.message });
  }
};

exports.downloadSalesRecords = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Records');
    worksheet.columns = [
      { header: 'CompanyName', key: 'companyName', width: 30 },
      { header: 'ItemName', key: 'itemName', width: 30 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Downloaded', key: 'isDownloaded', width: 15 },
      { header: 'CreatedAt', key: 'createdAt', width: 20 },
      { header: 'UpdatedAt', key: 'updatedAt', width: 20 },
    ];

    const records = await SaleRecord.find();
    records.forEach((record) => {
      record.itemsSold.forEach((item) => {
        worksheet.addRow({
          companyName: record.companyName,
          itemName: item.itemName,
          price: item.price || 'N/A', // Ensure price is shown even if not provided
          isDownloaded: record.isDownloaded ? 'Yes' : 'No',
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        });
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=sales-records-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    console.log('Sales records downloaded successfully');
    res.end();
  } catch (error) {
    console.error('Error downloading sales records:', error);
    res.status(500).json({ message: 'Failed to download records', error: error.message });
  }
};
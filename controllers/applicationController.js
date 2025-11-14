const Application = require('../models/Application');
const transporter = require('../config/email');

exports.submitApplication = async (req, res) => {
  try {
    const { jobId, jobTitle, firstName, profession, mobile, cvText, email, linkedin } = req.body;

    if (!jobId || !jobTitle || !firstName || !email) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const application = new Application({
      jobId,
      jobTitle,
      firstName,
      profession,
      mobile,
      cvText,
      email,
      linkedin
    });

    await application.save();

    const generateTableRow = (label, value, isEven = false) => {
      if (!value || value.trim() === '') return '';

      const bgColor = isEven ? 'background-color: #f2f2f2;' : '';
      return `
        <tr style="${bgColor}">
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; width: 30%;">${label}:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
        </tr>
      `;
    };

    let tableRows = '';
    let rowCount = 0;

    tableRows += generateTableRow('Müraciət edilən vəzifə', jobTitle, rowCount % 2 === 0);
    rowCount++;

    tableRows += generateTableRow('Ad, Soyad', firstName, rowCount % 2 === 0);
    rowCount++;

    tableRows += generateTableRow('Email', email, rowCount % 2 === 0);
    rowCount++;

    if (mobile && mobile.trim() !== '') {
      tableRows += generateTableRow('Telefon', mobile, rowCount % 2 === 0);
      rowCount++;
    }

    if (linkedin && linkedin.trim() !== '') {
      tableRows += generateTableRow('LinkedIn', linkedin, rowCount % 2 === 0);
      rowCount++;
    }

    if (cvText && cvText.trim() !== '') {
      tableRows += generateTableRow('Qeyd etmək istədiyiniz digər məlumatlar', cvText, rowCount % 2 === 0);
      rowCount++;
    }

    if (profession && profession.trim() !== '') {
      tableRows += generateTableRow('Müraciət etmək istədiyiniz peşə və ya sahə', profession, rowCount % 2 === 0);
      rowCount++;
    }

    tableRows += `
      <tr style="background-color: #f2f2f2;">
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Tarix:</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date().toLocaleString()}</td>
      </tr>
    `;

    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `New Job Application: ${jobTitle}`,
      html: `
        <h2 style="color: #333; font-family: Arial, sans-serif;">Yeni namizəd müraciəti qəbul edilmişdir</h2>
        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; border: 1px solid #ddd;">
          ${tableRows}
        </table>
      `,
      attachments: req.file
        ? [{ filename: req.file.originalname, content: req.file.buffer }]
        : []
    };

    // const userMailOptions = {
    //   from: process.env.SMTP_USER,
    //   to: email,
    //   subject: 'Müraciətin Qəbulu',
    //   html: `
    //     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000000;">
    //       <h2 style="color: #0346B8;">Hörmətli namizəd,</h2>
    //       <p>Müraciətiniz Abşeron Logistika Mərkəzinin Karyera portalı vasitəsilə uğurla qəbul edilmişdir.</p>
    //       <p>Bildirmək istəyirik ki, vakansiya üçün müraciət mərhələsi bitdikdən sonra bütün müraciətlər nəzərdən keçiriləcək. </p>
    //       <p>Yalnız vakansiyanın tələblərinə uyğun hesab edilən namizədlərlə növbəti mərhələdə əlaqə saxlanılacaqdır. </p>
    //       <p>Digər namizədlərin müraciətləri isə məlumat bazasında saxlanılaraq gələcək imkanlar üçün nəzərdən keçiriləcəkdir. </p>
    //       <p>Mərkəzimizə göstərdiyiniz marağa görə təşəkkür edirik.</p>
    //       <p> </p>
    //       <p>Hörmətlə,</p>
    //       <p>Abşeron Logistika Mərkəzi</p>
    //       <p>Vakansiyalardan bagli bizi Karyera portali ve ya sosial sebekelerden izleye bilersiz: <p>
    //       // two icon navigate to links  links
    //     </div>
    //   `
    // };

    const userMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Müraciətin Qəbulu',
      html: `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: Arial, Helvetica, sans-serif; background-color: #f9f9f9;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: white;">
            <!-- Header -->
            <tr>
              <td bgcolor="#0346B8" style="padding: 30px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Abşeron Logistika Mərkəzi</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 30px;">
                <h2 style="color: #0346B8; margin-top: 0; font-size: 20px; font-weight: bold;">Hörmətli namizəd,</h2>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 10px 0;">
                      <p style="margin: 0 0 15px 0; font-size: 16px; color: #444; line-height: 1.6;">
                        Müraciətiniz Abşeron Logistika Mərkəzinin Karyera portalı vasitəsilə uğurla qəbul edilmişdir.
                      </p>
                    </td>
                  </tr>
                  
                  
                  <tr>
                    <td style="padding: 10px 0;">
                      <p style="margin: 0 0 15px 0; font-size: 16px; color: #444; line-height: 1.6;">
                        Bildirmək istəyirik ki, vakansiya üçün müraciət mərhələsi bitdikdən sonra bütün müraciətlər nəzərdən keçiriləcək.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 10px 0;">
                      <p style="margin: 0 0 15px 0; font-size: 16px; color: #444; line-height: 1.6;">
                        Yalnız vakansiyanın tələblərinə uyğun hesab edilən namizədlərlə növbəti mərhələdə əlaqə saxlanılacaqdır.
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 10px 0;">
                      <p style="margin: 0 0 15px 0; font-size: 16px; color: #444; line-height: 1.6;">
                        Digər namizədlərin müraciətləri isə məlumat bazasında saxlanılaraq gələcək imkanlar üçün nəzərdən keçiriləcəkdir.
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Thank You Section -->
                <table width="100%" border="0" cellspacing="0" cellpadding="20" bgcolor="#f8f9fa">
                  <tr>
                    <td align="center">
                      <p style="margin: 0; font-style: italic; color: #666; font-size: 16px;">
                        Mərkəzimizə göstərdiyiniz marağa görə təşəkkür edirik.
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Signature -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 25px; border-top: 2px solid #e9ecef; padding-top: 25px;">
                  <tr>
                    <td>
                      <p style="margin: 5px 0; color: #555; font-size: 15px;">
                        <strong>Hörmətlə,</strong>
                      </p>
                      <p style="margin: 5px 0; color: #0346B8; font-size: 16px; font-weight: bold;">
                        Abşeron Logistika Mərkəzi
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Social Links -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px; border-top: 1px solid #e9ecef; padding-top: 20px;">
                  <tr>
                    <td align="center">
                      <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                        Vakansiyalardan bağlı bizi Karyera Portalı və ya sosial şəbəkələrdən izləyə bilərsiniz:
                      </p>
                      
                      <table border="0" cellspacing="10" cellpadding="0" align="center">
                        <tr>
                          <td>
                            <a href="https://career.absheronport.az/" style="display: block; background: #0346B8; color: white; padding: 10px 20px; text-decoration: none; font-size: 14px; font-weight: bold;">
                             Karyera Portalı
                            </a>
                          </td>
                          <td>
                            <a href="https://www.linkedin.com/company/103794108/" style="display: block; background: #0077B5; color: white; padding: 10px 20px; text-decoration: none; font-size: 14px; font-weight: bold;">
                            LinkedIn
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td bgcolor="#f1f5f9" style="padding: 15px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #64748b;">
                  © ${new Date().getFullYear()} Abşeron Logistika Mərkəzi. Bütün hüquqlar qorunur.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `
    };

    try {
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ success: true, message: 'Application submitted successfully' });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ applicationDate: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
};
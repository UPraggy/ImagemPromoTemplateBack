const db = require("../config/databasecloud");

exports.REST = async (req, res) => {
    try {
        const result = await db.query(`
        (select rev_num_rev ,rev_nom
            from erp_revistas
            where  rev_num_rev > 10080 and rev_num_rev < 11000
    order by rev_datinc desc)
    UNION ALL
    (select rev_num_rev ,rev_nom
            from erp_revistas
            where  rev_num_rev > 200 and rev_num_rev < 10000
    order by rev_datinc desc)
    ` );

        const rows = result.rows;

        if (rows.length === 0) {
            return res.json({ Error: "Erro: Nenhum resultado encontrado." });
        } else {
            return res.json(rows);
        }

    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }

};
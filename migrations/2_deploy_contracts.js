var AuditTracer = artifacts.require("AuditTracer");
module.exports = function(deployer) {
    deployer.deploy(AuditTracer,
    {
        oasis: { confidential: true }
    });
};

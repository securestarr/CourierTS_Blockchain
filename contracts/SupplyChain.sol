// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {
    // Owner of the contract (person deploying it)
    address public owner;

    struct Product {
        uint id;
        string name;
        string manufacturer;
        string currentLocation;
    }

    Product[] public products;

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Constructor sets the owner when deployed and populates 15 sample products
    constructor() {
        owner = msg.sender;
        addSampleProducts();
    }

    // Function to populate products array with sample products
    function addSampleProducts() private {
        string[15] memory productNames = [
            "Laptop", "Smartphone", "Tablet", "Monitor", "Headphones",
            "Mouse", "Keyboard", "Printer", "Smartwatch", "Camera",
            "Router", "External HDD", "USB Flash Drive", "Graphics Card", "Speakers"
        ];
        string[15] memory manufacturers = [
            "TechCorp", "MobileX", "TabWorld", "VisionTech", "AudioPlus",
            "ClickMaster", "KeyPro", "PrintPro", "TimeTech", "PixStream",
            "NetWave", "StorePro", "DataDrive", "GraphixPro", "SoundTech"
        ];
        string[15] memory locations = [
            "Warehouse 1", "Warehouse 2", "Store 3", "Store 4", "Store 5",
            "Warehouse 6", "Warehouse 7", "Store 8", "Store 9", "Store 10",
            "Warehouse 11", "Warehouse 12", "Store 13", "Store 14", "Store 15"
        ];

        for (uint i = 0; i < 15; i++) {
            products.push(Product({
                id: i + 1,
                name: productNames[i],
                manufacturer: manufacturers[i],
                currentLocation: locations[i]
            }));
        }
    }

    function getAllProducts() public view returns (Product[] memory) {
        return products;
    }

    // Enum to define stages in the supply chain
    enum PackageStage {
        Created,
        InTransit,
        Delivered,
        Completed
    }

    // Package structure to track supply chain information
    struct Package {
        uint256 id;
        string description;
        address currentHandler;
        PackageStage stage;
        address creator;
        uint256 timestamp;
    }

    struct PackageHistory {
        PackageStage stage;
        address handler;
        uint256 timestamp;
    }

    uint256 public packageCounter;

    // Mappings for package details and history
    mapping(uint256 => address[]) private packageHandlers;
    mapping(uint256 => Package) public packages;
    mapping(uint256 => PackageHistory[]) public packageHistories;

    // Events for logging package operations
    event PackageCreated(uint256 packageId, string description, address creator);
    event PackageStatusUpdated(uint256 packageId, uint8 stage, address handler, uint256 timestamp);

    // Function to create a new package
    function createPackage(string memory _description) public {
        packageCounter++;
        packages[packageCounter] = Package({
            id: packageCounter,
            description: _description,
            currentHandler: msg.sender,
            stage: PackageStage.Created,
            creator: msg.sender,
            timestamp: block.timestamp
        });

        packageHistories[packageCounter].push(PackageHistory({
            stage: PackageStage.Created,
            handler: msg.sender,
            timestamp: block.timestamp
        }));

        packageHandlers[packageCounter].push(msg.sender); // Add creator to handler history

        emit PackageCreated(packageCounter, _description, msg.sender);
    }

    // Function to update the package status and handler
    function updatePackageStatus(uint256 packageId, uint8 newStage, address newHandler) public { 
    require(packageId > 0 && packageId <= packageCounter, "Invalid package ID");
    require(newStage >= uint8(PackageStage.Created) && newStage <= uint8(PackageStage.Completed), "Invalid stage");
    require(newHandler != address(0), "Invalid handler address");

    Package storage pkg = packages[packageId];

    // 🚀 Removed authorization check - Now ANY account can update the package status

    // Update the package stage and handler
    pkg.stage = PackageStage(newStage);
    pkg.currentHandler = newHandler;

    // Record the update in the package history
    packageHistories[packageId].push(PackageHistory({
        stage: PackageStage(newStage),
        handler: newHandler,
        timestamp: block.timestamp
    }));

    packageHandlers[packageId].push(newHandler); // Update handler list

    emit PackageStatusUpdated(packageId, newStage, newHandler, block.timestamp);
}
    // Retrieve the handler history for a package
    function getPackageHandlers(uint256 packageId) public view returns (address[] memory) {
        require(packageId > 0 && packageId <= packageCounter, "Invalid package ID");
        return packageHandlers[packageId];
    }

    // Retrieve the history of a package
    function getPackageHistory(uint256 packageId) public view returns (PackageHistory[] memory) {
        require(packageId > 0 && packageId <= packageCounter, "Invalid package ID");
        return packageHistories[packageId];
    }
}

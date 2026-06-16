// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Land {
        uint256 landId;
        string title;
        string location;
        uint256 area;
        address owner;
        bool isForSale;
        uint256 price;
    }

    mapping(uint256 => Land) public lands;

    // 🔥 EVENTS
    event LandRegistered(uint256 landId, address owner);
    event LandListed(uint256 landId, uint256 price);
    event LandSold(uint256 landId, address newOwner);

    // 🔐 ONLY ADMIN
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    // 🚀 ADMIN REGISTERS LAND AFTER APPROVAL
    function registerLand(
        uint256 _landId,
        string memory _title,
        string memory _location,
        uint256 _area,
        address _owner
    ) public onlyAdmin {

        require(lands[_landId].landId == 0, "Land already exists");

        lands[_landId] = Land({
            landId: _landId,
            title: _title,
            location: _location,
            area: _area,
            owner: _owner,
            isForSale: false,
            price: 0
        });

        emit LandRegistered(_landId, _owner);
    }

    // 💰 LIST LAND FOR SALE (🔥 FIXED: removed onlyOwner)
    function listForSale(uint256 _landId, uint256 _price)
        public
    {
        require(_price > 0, "Invalid price");

        lands[_landId].isForSale = true;
        lands[_landId].price = _price;

        emit LandListed(_landId, _price);
    }

    // 💸 BUY LAND
    function buyLand(uint256 _landId) public payable {
        Land storage land = lands[_landId];

        require(land.isForSale, "Not for sale");
        require(msg.value >= land.price, "Insufficient payment");

        address previousOwner = land.owner;

        // 🔥 transfer ownership
        land.owner = msg.sender;
        land.isForSale = false;
        land.price = 0;

        // 🔥 transfer ETH
        payable(previousOwner).transfer(msg.value);

        emit LandSold(_landId, msg.sender);
    }

    // 🔍 GET LAND
    function getLand(uint256 _landId)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            address,
            bool,
            uint256
        )
    {
        Land memory l = lands[_landId];
        return (
            l.landId,
            l.title,
            l.location,
            l.area,
            l.owner,
            l.isForSale,
            l.price
        );
    }
}
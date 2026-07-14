"use client";

export default function BillForm({
  // ===== SERVICES =====
  services,
  form,
  setForm,
  searchService,
  setSearchService,
  displayedServices,

  // ===== PRODUCTS =====
  products,
  selectedProducts,
  setSelectedProducts,
  searchProduct,
  setSearchProduct,

  // ===== STAFF =====
  staff,
  showStaffDropdown,
  setShowStaffDropdown,

  // ===== TOTALS =====
  serviceTotal,
  productTotal,
  totalAmount,

  // ===== SUBMIT =====
  creatingBill,
  createBill,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">New Bill</h2>

      <form onSubmit={createBill} className="space-y-5">
        {/* ===== CUSTOMER DETAILS ===== */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="10 digit mobile number"
              required
            />
          </div>
        </div>

        {/* ===== SERVICES SECTION ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Services
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="🔍 Search services..."
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            {searchService && (
              <button
                type="button"
                onClick={() => setSearchService("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
            {displayedServices.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-8">
                No services found
              </div>
            ) : (
              displayedServices.map((service) => (
                <button
                  key={service._id}
                  type="button"
                  onClick={() => {
                    if (form.services.includes(service._id)) {
                      setForm({
                        ...form,
                        services: form.services.filter((id) => id !== service._id),
                      });
                    } else {
                      setForm({
                        ...form,
                        services: [...form.services, service._id],
                      });
                    }
                  }}
                  className={`p-3 rounded-xl text-left transition-all ${
                    form.services.includes(service._id)
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-50 border-2 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="font-medium">{service.name}</div>
                  <div
                    className={`text-sm mt-1 ${
                      form.services.includes(service._id)
                        ? "text-blue-100"
                        : "text-blue-600"
                    }`}
                  >
                    ₹{service.price}
                  </div>
                </button>
              ))
            )}
          </div>

          {form.services.length > 0 && (
            <div className="mt-4 border border-blue-200 bg-blue-50/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-700">
                  📌 {form.services.length} Service
                  {form.services.length > 1 ? "s" : ""} Selected
                </p>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, services: [] })}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              {services
                .filter((s) => form.services.includes(s._id))
                .map((service) => (
                  <div
                    key={service._id}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100 mb-1"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {service.name} - ₹{service.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          ...form,
                          services: form.services.filter((id) => id !== service._id),
                        });
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ===== PRODUCTS SECTION ===== */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🛒 Products (Optional)
          </label>
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
            {products
              .filter(
                (p) =>
                  p.stockQuantity > 0 &&
                  p.name.toLowerCase().includes(searchProduct.toLowerCase())
              )
              .slice(0, 12)
              .map((product) => {
                const isSelected = selectedProducts.find(
                  (p) => p.productId === product._id
                );
                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedProducts(
                          selectedProducts.filter((p) => p.productId !== product._id)
                        );
                      } else {
                        setSelectedProducts([
                          ...selectedProducts,
                          {
                            productId: product._id,
                            name: product.name,
                            price: product.mrp,
                            quantity: 1,
                            stock: product.stockQuantity,
                          },
                        ]);
                      }
                    }}
                    className={`p-2 rounded-xl text-left transition-all text-sm ${
                      isSelected
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-50 border-2 border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-medium">{product.name}</div>
                    <div
                      className={`text-xs ${
                        isSelected ? "text-green-100" : "text-gray-500"
                      }`}
                    >
                      ₹{product.mrp} | Stock: {product.stockQuantity}
                    </div>
                  </button>
                );
              })}
          </div>

          {selectedProducts.length > 0 && (
            <div className="mt-3 border border-green-200 bg-green-50/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-700">
                  📦 {selectedProducts.length} Product
                  {selectedProducts.length > 1 ? "s" : ""} Selected
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedProducts([])}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              {selectedProducts.map((p) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-green-100 mb-1"
                >
                  <span className="text-sm font-medium text-gray-800 flex-1">
                    {p.name}
                  </span>
                  <span className="text-xs text-gray-500 mx-2">₹{p.price}</span>
                  <input
                    type="number"
                    value={p.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, parseInt(e.target.value) || 1);
                      setSelectedProducts(
                        selectedProducts.map((sp) =>
                          sp.productId === p.productId
                            ? { ...sp, quantity: qty }
                            : sp
                        )
                      );
                    }}
                    className="w-12 px-1 py-0.5 border border-gray-200 rounded text-xs text-center"
                    min="1"
                    max={p.stock}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProducts(
                        selectedProducts.filter((sp) => sp.productId !== p.productId)
                      )
                    }
                    className="text-red-400 hover:text-red-600 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== STAFF + PAYMENT ===== */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Staff *
            </label>
            <div className="relative staff-select-container">
              <button
                type="button"
                onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
              >
                <span className={form.staffId ? "text-gray-800" : "text-gray-400"}>
                  {form.staffId
                    ? staff.find((m) => m._id === form.staffId)?.name
                    : "Select staff member"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    showStaffDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showStaffDropdown && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, staffId: "" });
                      setShowStaffDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100 text-gray-400"
                  >
                    Select staff member
                  </button>
                  {staff.map((member) => (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, staffId: member._id });
                        setShowStaffDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center justify-between ${
                        form.staffId === member._id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-gray-400">
                          {member.role || "Staff"}
                        </p>
                      </div>
                      {form.staffId === member._id && (
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Mode *
            </label>
            <div className="flex gap-3">
              {["Cash", "UPI", "Card"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMode: mode })}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                    form.paymentMode === mode
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== FINAL AMOUNT ===== */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Service Total:</span>
            <span className="text-lg font-bold text-gray-800">₹{serviceTotal}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Product Total:</span>
            <span className="text-lg font-bold text-gray-800">₹{productTotal}</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Subtotal:</span>
            <span className="text-xl font-bold text-blue-600">₹{totalAmount}</span>
          </div>
          <div className="border-t pt-3 mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Amount *
            </label>
            <input
              type="number"
              value={form.finalAmount}
              onChange={(e) => setForm({ ...form, finalAmount: e.target.value })}
              onWheel={(e) => e.target.blur()}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 text-lg font-bold"
              placeholder="Enter final amount"
              required
            />
            {totalAmount > 0 && form.finalAmount && (
              <p
                className={`text-sm mt-2 ${
                  Number(form.finalAmount) > totalAmount
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {Number(form.finalAmount) > totalAmount
                  ? `⚠️ Extra charges: ₹${
                      Number(form.finalAmount) - totalAmount
                    } added`
                  : Number(form.finalAmount) < totalAmount
                  ? `💸 Discount given: ₹${
                      totalAmount - Number(form.finalAmount)
                    }`
                  : `✓ Exact amount`}
              </p>
            )}
          </div>
        </div>

        {/* ===== SUBMIT BUTTON ===== */}
        <button
          type="submit"
          disabled={
            (form.services.length === 0 && selectedProducts.length === 0) ||
            !form.staffId ||
            !form.finalAmount ||
            creatingBill
          }
          className={`w-full text-white font-semibold py-3 rounded-xl text-lg no-print transition ${
            (form.services.length === 0 && selectedProducts.length === 0) ||
            !form.staffId ||
            !form.finalAmount ||
            creatingBill
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {creatingBill ? "Creating Bill..." : "💾 Save & Print Bill"}
        </button>
      </form>
    </div>
  );
}
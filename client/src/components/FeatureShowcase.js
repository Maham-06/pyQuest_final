const FeatureShowcase = ({ title, description, image, imageAlt, icon, reverse }) => {
  return (
    <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8`}>
      <div className="md:w-1/2">
        <div className="relative">
          <img src={image || "/placeholder.svg"} alt={imageAlt} className="rounded-lg shadow-lg w-full" />
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl z-10">
            {icon}
          </div>
        </div>
      </div>

      <div className="md:w-1/2">
        <div className={`relative ${reverse ? "md:pr-6" : "md:pl-6"}`}>
          {/* Connection to timeline */}
          <div
            className={`hidden md:block absolute top-1/2 ${reverse ? "left-0" : "right-0"} w-6 h-1 bg-primary/50`}
          ></div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureShowcase

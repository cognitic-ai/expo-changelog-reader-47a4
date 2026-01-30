import WidgetKit
import SwiftUI

struct BlogPost: Codable, Identifiable {
    let id: String
    let title: String
    let link: String
    let pubDate: String
    let description: String?
    let thumbnail: String?
    let formattedDate: String
}

struct RSSFeed: Codable {
    let title: String
    let description: String
    let posts: [BlogPost]
}

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), posts: [], configuration: ConfigurationAppIntent())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        if context.isPreview {
            return SimpleEntry(date: Date(), posts: getSamplePosts(), configuration: configuration)
        }

        let posts = await fetchPosts()
        return SimpleEntry(date: Date(), posts: posts, configuration: configuration)
    }

    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let posts = await fetchPosts()
        let currentDate = Date()
        let entry = SimpleEntry(date: currentDate, posts: posts, configuration: configuration)

        // Update every hour
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: currentDate)!
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }

    func fetchPosts() async -> [BlogPost] {
        // Use AllOrigins CORS proxy to fetch RSS
        guard let url = URL(string: "https://api.allorigins.win/raw?url=https://expo.dev/changelog/rss.xml") else {
            return []
        }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let posts = parseRSS(data: data)
            return Array(posts.prefix(10))
        } catch {
            print("Failed to fetch RSS: \(error)")
            return []
        }
    }

    func parseRSS(data: Data) -> [BlogPost] {
        let parser = XMLParser(data: data)
        let delegate = RSSParserDelegate()
        parser.delegate = delegate
        parser.parse()
        return delegate.posts
    }

    func getSamplePosts() -> [BlogPost] {
        return [
            BlogPost(
                id: "1",
                title: "Expo SDK 55 Beta Released",
                link: "https://expo.dev/changelog",
                pubDate: "2025-01-15",
                description: "New features including Expo Router v7",
                thumbnail: nil,
                formattedDate: "January 15, 2025"
            ),
            BlogPost(
                id: "2",
                title: "Expo Router Updates",
                link: "https://expo.dev/changelog",
                pubDate: "2025-01-10",
                description: "Stack Toolbar and more",
                thumbnail: nil,
                formattedDate: "January 10, 2025"
            )
        ]
    }
}

class RSSParserDelegate: NSObject, XMLParserDelegate {
    var posts: [BlogPost] = []
    var currentElement = ""
    var currentTitle = ""
    var currentLink = ""
    var currentPubDate = ""
    var currentDescription = ""
    var currentGuid = ""
    var currentThumbnail = ""

    func parser(_ parser: XMLParser, didStartElement elementName: String, namespaceURI: String?, qualifiedName qName: String?, attributes attributeDict: [String : String] = [:]) {
        currentElement = elementName
        if elementName == "item" {
            currentTitle = ""
            currentLink = ""
            currentPubDate = ""
            currentDescription = ""
            currentGuid = ""
            currentThumbnail = ""
        }
        if elementName == "media:thumbnail", let url = attributeDict["url"] {
            currentThumbnail = url
        }
    }

    func parser(_ parser: XMLParser, foundCharacters string: String) {
        let data = string.trimmingCharacters(in: .whitespacesAndNewlines)
        if !data.isEmpty {
            switch currentElement {
            case "title": currentTitle += data
            case "link": currentLink += data
            case "pubDate": currentPubDate += data
            case "description": currentDescription += data
            case "guid": currentGuid += data
            default: break
            }
        }
    }

    func parser(_ parser: XMLParser, didEndElement elementName: String, namespaceURI: String?, qualifiedName qName: String?) {
        if elementName == "item" {
            let formattedDate = formatDate(currentPubDate)
            let post = BlogPost(
                id: currentGuid.isEmpty ? currentLink : currentGuid,
                title: currentTitle,
                link: currentLink,
                pubDate: currentPubDate,
                description: currentDescription.isEmpty ? nil : currentDescription,
                thumbnail: currentThumbnail.isEmpty ? nil : currentThumbnail,
                formattedDate: formattedDate
            )
            posts.append(post)
        }
    }

    func formatDate(_ dateString: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE, dd MMM yyyy HH:mm:ss Z"
        if let date = formatter.date(from: dateString) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateStyle = .long
            return displayFormatter.string(from: date)
        }
        return dateString
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let posts: [BlogPost]
    let configuration: ConfigurationAppIntent
}

struct WidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(posts: entry.posts)
        case .systemMedium:
            MediumWidgetView(posts: entry.posts)
        case .systemLarge:
            LargeWidgetView(posts: entry.posts)
        default:
            SmallWidgetView(posts: entry.posts)
        }
    }
}

struct SmallWidgetView: View {
    let posts: [BlogPost]

    var body: some View {
        if let latestPost = posts.first {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Image(systemName: "newspaper.fill")
                        .foregroundColor(.blue)
                    Text("Expo")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.secondary)
                    Spacer()
                }

                Spacer()

                Text(latestPost.title)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .lineLimit(3)

                Text(latestPost.formattedDate)
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding()
            .containerBackground(.fill.tertiary, for: .widget)
        } else {
            VStack {
                Image(systemName: "newspaper")
                    .font(.largeTitle)
                    .foregroundColor(.secondary)
                Text("No posts")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .containerBackground(.fill.tertiary, for: .widget)
        }
    }
}

struct MediumWidgetView: View {
    let posts: [BlogPost]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "newspaper.fill")
                    .foregroundColor(.blue)
                Text("Expo Changelog")
                    .font(.headline)
                    .fontWeight(.bold)
                Spacer()
            }

            if let latestPost = posts.first {
                VStack(alignment: .leading, spacing: 4) {
                    Text(latestPost.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .lineLimit(2)

                    if let description = latestPost.description {
                        Text(description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }

                    Text(latestPost.formattedDate)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()
        }
        .padding()
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct LargeWidgetView: View {
    let posts: [BlogPost]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "newspaper.fill")
                    .foregroundColor(.blue)
                Text("Expo Changelog")
                    .font(.headline)
                    .fontWeight(.bold)
                Spacer()
            }

            ForEach(posts.prefix(3)) { post in
                VStack(alignment: .leading, spacing: 4) {
                    Text(post.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .lineLimit(2)

                    if let description = post.description {
                        Text(description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }

                    Text(post.formattedDate)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 4)

                if post.id != posts.prefix(3).last?.id {
                    Divider()
                }
            }

            Spacer()
        }
        .padding()
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            WidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Expo Changelog")
        .description("Latest articles from the Expo changelog")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(date: .now, posts: Provider().getSamplePosts(), configuration: ConfigurationAppIntent())
}

#Preview(as: .systemMedium) {
    widget()
} timeline: {
    SimpleEntry(date: .now, posts: Provider().getSamplePosts(), configuration: ConfigurationAppIntent())
}

#Preview(as: .systemLarge) {
    widget()
} timeline: {
    SimpleEntry(date: .now, posts: Provider().getSamplePosts(), configuration: ConfigurationAppIntent())
}

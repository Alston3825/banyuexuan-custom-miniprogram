import Foundation
import AVFoundation
import AppKit
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let duration = CMTimeGetSeconds(asset.duration)
print("Duration: \(duration)")
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: 440, height: 900)
for i in 0..<24 {
 let second = duration * Double(i) / 24
 do {
 let image = try generator.copyCGImage(at: CMTime(seconds: second, preferredTimescale: 600), actualTime: nil)
 let rep = NSBitmapImageRep(cgImage: image)
 try rep.representation(using: .jpeg, properties: [.compressionFactor: 0.8])!.write(to: URL(fileURLWithPath: "reference/frame-\(i).jpg"))
 print("\(i): \(Int(second))s")
 } catch { print(error) }
}

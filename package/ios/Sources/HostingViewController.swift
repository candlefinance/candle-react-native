import SwiftUI
import UIKit

extension UIViewController {
  func embed(_ child: UIViewController) {
    addChild(child)
    view.insertSubview(child.view, belowSubview: view.subviews.first ?? view)
    child.view.pinEdges(to: view)
    child.didMove(toParent: self)
  }

  func embedOnTop(_ child: UIViewController) {
    addChild(child)
    view.insertSubview(child.view, aboveSubview: view)
    child.view.pinEdges(to: view)
    child.didMove(toParent: self)
  }

  func removeEmbedded(_ child: UIViewController) {
    child.willMove(toParent: nil)
    child.view.removeFromSuperview()
    child.removeFromParent()
  }
}

extension UIView {
  func pinEdges(to superview: UIView) {
    translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      leadingAnchor.constraint(equalTo: superview.leadingAnchor),
      trailingAnchor.constraint(equalTo: superview.trailingAnchor),
      topAnchor.constraint(equalTo: superview.topAnchor),
      bottomAnchor.constraint(equalTo: superview.bottomAnchor),
    ])
  }
}
